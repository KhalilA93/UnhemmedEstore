import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { orderAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';

const OrderHistory = () => {
  const { orders, user, loading } = useApp();
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, [currentPage, statusFilter]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderAPI.getOrderHistory(currentPage, 10);
      setAllOrders(response.data.orders || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to load order history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderClick = async (orderId) => {
    try {
      setIsLoading(true);
      const response = await orderAPI.getById(orderId);
      setSelectedOrder(response.data.order);
    } catch (error) {
      console.error('Failed to load order details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId, reason) => {
    try {
      await orderAPI.cancelOrder(orderId, reason);
      loadOrders(); // Reload orders
      setSelectedOrder(null);
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  const handleReturnOrder = async (orderId, items, reason) => {
    try {
      await orderAPI.initiateReturn(orderId, items, reason);
      loadOrders(); // Reload orders
      setSelectedOrder(null);
    } catch (error) {
      console.error('Failed to initiate return:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', label: 'Pending' },
      confirmed: { class: 'status-confirmed', label: 'Confirmed' },
      processing: { class: 'status-processing', label: 'Processing' },
      shipped: { class: 'status-shipped', label: 'Shipped' },
      delivered: { class: 'status-delivered', label: 'Delivered' },
      cancelled: { class: 'status-cancelled', label: 'Cancelled' },
      returned: { class: 'status-returned', label: 'Returned' },
      refunded: { class: 'status-refunded', label: 'Refunded' }
    };

    const config = statusConfig[status] || { class: 'status-unknown', label: status };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const filteredOrders = allOrders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  );

  if (isLoading && !allOrders.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="order-history">
      <div className="section-header">
        <h2>Order History</h2>
        <div className="order-filters">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      {!selectedOrder ? (
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="no-orders">
              <h3>No orders found</h3>
              <p>You haven't placed any orders yet.</p>
              <Button href="/products">Start Shopping</Button>
            </div>
          ) : (
            <>
              {filteredOrders.map(order => (
                <div 
                  key={order._id} 
                  className="order-card"
                  onClick={() => handleOrderClick(order._id)}
                >
                  <div className="order-header">
                    <div className="order-info">
                      <h4>Order #{order.orderNumber}</h4>
                      <p className="order-date">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="order-status">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                  
                  <div className="order-summary">
                    <div className="order-items">
                      <p>{order.items?.length || 0} item(s)</p>
                      {order.items?.slice(0, 2).map(item => (
                        <span key={item._id} className="item-name">
                          {item.productName}
                        </span>
                      ))}
                      {order.items?.length > 2 && (
                        <span className="more-items">
                          +{order.items.length - 2} more
                        </span>
                      )}
                    </div>
                    
                    <div className="order-total">
                      <strong>${order.total?.toFixed(2) || '0.00'}</strong>
                    </div>
                  </div>
                  
                  {order.tracking?.trackingNumber && (
                    <div className="tracking-info">
                      <span>Tracking: {order.tracking.trackingNumber}</span>
                    </div>
                  )}
                </div>
              ))}

              {totalPages > 1 && (
                <div className="pagination">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Previous
                  </Button>
                  
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <OrderDetail 
          order={selectedOrder}
          onBack={() => setSelectedOrder(null)}
          onCancel={handleCancelOrder}
          onReturn={handleReturnOrder}
        />
      )}
    </div>
  );
};

const OrderDetail = ({ order, onBack, onCancel, onReturn }) => {
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const canCancel = ['pending', 'confirmed'].includes(order.status);
  const canReturn = ['delivered'].includes(order.status);

  const handleCancelSubmit = (e) => {
    e.preventDefault();
    if (cancelReason.trim()) {
      onCancel(order._id, cancelReason);
    }
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    if (returnReason.trim() && selectedItems.length > 0) {
      onReturn(order._id, selectedItems, returnReason);
    }
  };

  return (
    <div className="order-detail">
      <div className="detail-header">
        <Button variant="outline" onClick={onBack}>
          ← Back to Orders
        </Button>
        <div className="order-title">
          <h3>Order #{order.orderNumber}</h3>
          {order.status && (
            <span className={`status-badge status-${order.status}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          )}
        </div>
      </div>

      <div className="order-details-grid">
        <div className="order-info-section">
          <h4>Order Information</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Order Date:</span>
              <span className="value">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Payment Method:</span>
              <span className="value">{order.paymentMethod || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Shipping Address:</span>
              <span className="value">
                {order.shippingAddress ? (
                  <>
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </>
                ) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="order-items-section">
          <h4>Items Ordered</h4>
          <div className="items-list">
            {order.items?.map(item => (
              <div key={item._id} className="order-item">
                <div className="item-info">
                  <h5>{item.productName}</h5>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.price?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="item-total">
                  ${((item.price || 0) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-summary-section">
          <h4>Order Summary</h4>
          <div className="summary-lines">
            <div className="summary-line">
              <span>Subtotal:</span>
              <span>${(order.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping:</span>
              <span>${(order.shippingCost || 0).toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Tax:</span>
              <span>${(order.tax || 0).toFixed(2)}</span>
            </div>
            <div className="summary-line total">
              <span>Total:</span>
              <span>${(order.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="order-actions">
        {canCancel && (
          <Button 
            variant="outline" 
            onClick={() => setShowCancelForm(true)}
          >
            Cancel Order
          </Button>
        )}
        
        {canReturn && (
          <Button 
            variant="outline" 
            onClick={() => setShowReturnForm(true)}
          >
            Return Items
          </Button>
        )}
        
        {order.tracking?.trackingNumber && (
          <Button variant="outline">
            Track Package
          </Button>
        )}
      </div>

      {/* Cancel Order Modal */}
      {showCancelForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cancel Order</h3>
            <form onSubmit={handleCancelSubmit}>
              <div className="form-group">
                <label>Reason for cancellation:</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason for cancelling this order..."
                  required
                />
              </div>
              <div className="modal-actions">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCancelForm(false)}
                >
                  Close
                </Button>
                <Button type="submit">
                  Cancel Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Items Modal */}
      {showReturnForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Return Items</h3>
            <form onSubmit={handleReturnSubmit}>
              <div className="form-group">
                <label>Select items to return:</label>
                {order.items?.map(item => (
                  <label key={item._id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, item._id]);
                        } else {
                          setSelectedItems(selectedItems.filter(id => id !== item._id));
                        }
                      }}
                    />
                    {item.productName} (${item.price?.toFixed(2)})
                  </label>
                ))}
              </div>
              <div className="form-group">
                <label>Reason for return:</label>
                <textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="Please provide a reason for returning these items..."
                  required
                />
              </div>
              <div className="modal-actions">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowReturnForm(false)}
                >
                  Close
                </Button>
                <Button type="submit">
                  Process Return
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;