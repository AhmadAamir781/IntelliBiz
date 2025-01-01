import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

function BusinessCard({ business }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="business-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
    >
      <div className="card-image">
        <img src={business.image} alt={business.name} />
        <div className="rating">
          <FaStar />
          <span>{business.rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="card-content">
        <h3>{business.name}</h3>
        <p>{business.description}</p>
        <div className="owner">
          <img src={business.ownerImage} alt={business.owner} />
          <span>{business.owner}</span>
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="popup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h4>{business.name}</h4>
            <div className="popup-info">
              <FaMapMarkerAlt />
              <span>{business.location.address}</span>
            </div>
            <div className="popup-info">
              <FaClock />
              <span>{business.openingTime} - {business.closingTime}</span>
            </div>
            <p>Distance: {business.distance}</p>
            <p>{business.remarks}</p>
            <div className="map">
              <img
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${business.location.lat},${business.location.lng}&zoom=15&size=300x150&markers=color:red%7C${business.location.lat},${business.location.lng}&key=YOUR_GOOGLE_MAPS_API_KEY`}
                alt={`Map of ${business.name}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default BusinessCard;