import React from "react";
import "./StaticPages.css";

const Delivery = () => {
  return (
    <div className="static-page">
      <h1>Delivery Information</h1>

      <p>
        Campus Bites delivers within the campus premises only.
        Orders are delivered to your selected block, room, or table.
      </p>

      <h3>Delivery Timings</h3>
      <ul>
        <li>Monday – Saturday: 9:00 AM – 4:30 PM</li>
        
      </ul>

      <h3>Estimated Delivery Time</h3>
      <p>
        Orders are usually delivered within 10–25 minutes depending on
        preparation time and order volume.
      </p>

      <h3>Delivery Charges</h3>
      <p>
        A minimal delivery fee is applied to maintain fast and reliable service.
      </p>

      <p>
        For bulk or special event orders, please contact us directly.
      </p>
    </div>
  );
};

export default Delivery;
