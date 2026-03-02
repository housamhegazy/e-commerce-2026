import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  const { title, price, images, averageRating, _id, stock } = product;
  const thumbnail = images[0]?.url || 'https://via.placeholder.com/300';

  return (
    <div className="col-md-3 col-sm-6 mb-4">
      {/* تعديل لون خلفية الكارد والبوردر */}
      <div className="card h-100 shadow-lg border-0 position-relative" 
           style={{ backgroundColor: '#2d3748', borderRadius: '15px', overflow: 'hidden' }}>
        
        {/* Rating Badge */}
        <div className="position-absolute top-0 start-0 m-2 badge rounded-pill" 
             style={{ backgroundColor: '#f6ad55', color: '#1a202c' }}>
          ★ {averageRating}
        </div>

        {/* Product Image */}
        <div style={{ height: '220px', overflow: 'hidden' }}>
          <img 
            src={thumbnail} 
            className="card-img-top h-100 w-100 object-fit-cover transition-scale" 
            alt={title} 
            style={{ transition: 'transform 0.3s ease' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>

        <div className="card-body d-flex flex-column text-white">
          <h5 className="card-title fs-6 fw-bold text-truncate" style={{ color: '#edf2f7' }}>{title}</h5>
          
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="h5 mb-0 fw-bold" style={{ color: '#63b3ed' }}>${price}</span>
              <span className={`badge ${stock > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                {stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="d-grid gap-2">
              <button 
                className="btn btn-sm fw-bold shadow-sm"
                style={{ backgroundColor: '#f6ad55', color: '#1a202c', border: 'none' }}
                onClick={() => onAddToCart(product)}
                disabled={stock === 0}
              >
                <i className="bi bi-cart-plus me-1"></i> Add to Cart
              </button>
              <Link to={`/product/${_id}`} 
                    className="btn btn-outline-light btn-sm opacity-75 border-secondary">
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;