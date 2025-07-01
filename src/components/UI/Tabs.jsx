import { useState } from 'react';

// CLASES adventure-tabs y adventure-tab incluidas
const Tabs = ({ tabs }) => {
  const [active, setActive] = useState(0);

  return (
    <div className="adventure-tabs-container">
      <div className="adventure-tabs-row">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActive(idx)}
            className={`adventure-tab${active === idx ? ' active' : ''}`}
            type="button"
          >
            {tab.icon && <span style={{ marginRight: 8 }}>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="adventure-tab-content">
        {tabs[active].content}
      </div>
      <style>{`
        .adventure-tabs-container {
          font-family: 'Pirata One', cursive;
          width: 100%;
          margin: 0 auto;
        }
        .adventure-tabs-row {
          display: flex;
          gap: 10px;
          background: linear-gradient(90deg,#a87e42 0%,#d1ba6b 100%);
          padding: 7px 8px 4px 8px;
          border-radius: 16px 16px 0 0;
          border-bottom: 4px solid #68522b;
          box-shadow: 0 3px 12px #99833333;
          margin-bottom: 0;
        }
        .adventure-tab {
          flex: 1;
          padding: 12px 0 10px 0;
          font-size: 18px;
          background: linear-gradient(120deg, #ece1b5 80%, #c3ac69 100%);
          color: #56421d;
          border: 2.5px solid #ad9c62;
          border-bottom: none;
          border-radius: 12px 14px 0 0;
          margin-right: 2px;
          margin-bottom: -2px;
          font-family: 'Pirata One', cursive;
          letter-spacing: 1px;
          box-shadow: 0 2px 7px #b7a7513b;
          cursor: pointer;
          transition: 
            background 0.12s, color 0.1s, box-shadow 0.18s, border 0.12s;
          outline: none;
          position: relative;
        }
        .adventure-tab.active {
          background: linear-gradient(120deg, #e1c894 85%, #fff8c4 100%);
          color: #d4a33a;
          border-bottom: 4px solid #d4a33a;
          font-size: 19px;
          box-shadow: 0 4px 16px #b9a97e88,0 1.5px 0 #b7a751;
          z-index: 2;
        }
        .adventure-tab:not(.active):hover {
          background: #ead59b;
          color: #8d6f2b;
        }
        .adventure-tab-content {
          background: #fcf6e6;
          border-radius: 0 0 20px 20px;
          box-shadow: 0 2px 12px #99833333;
          border: 3.5px solid #b7a751;
          border-top: none;
          padding: 26px 28px 24px 28px;
          min-height: 250px;
          color: #4d3b13;
          font-size: 16px;
        }
        @media (max-width: 600px) {
          .adventure-tab { font-size: 16px; }
          .adventure-tab-content { padding: 13px 7px; }
        }
      `}</style>
    </div>
  );
};

export default Tabs;
