import React from 'react';
import useAuth from '../hooks/useAuth';
import AssistanceStatsDashboard from '../components/assistance/AssistanceStatsDashboard';
import ScoreManager from '../components/ScoreManager';

const Dashboard = () => {
  const { user, person } = useAuth();

  return (
    <div className="adventure-dash-bg">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pirata+One&family=Press+Start+2P&display=swap');
        .adventure-dash-bg {
          background: linear-gradient(135deg, #647057 0%, #2a3622 100%) fixed;
          display: flex;
          flex-direction: column;
        }
        .dash-header {
          height: 68px;
          background: linear-gradient(90deg, #a87e42 0%, #d1ba6b 100%);
          color: #fffbe0;
          box-shadow: 0 2px 18px #2a362285;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 38px;
          border-bottom: 7px solid #6b5423;
          font-family: 'Pirata One', cursive;
          position: relative;
          z-index: 3;
        }
        .dash-header:before {
          content: '';
          position: absolute;
          left: 24px; top: 11px;
          width: 32px; height: 32px;
          background: url('https://em-content.zobj.net/source/microsoft-teams/337/tanabata-tree_1f38b.png') no-repeat center/contain;
          filter: drop-shadow(2px 4px 2px #3b2d1a);
          opacity: 0.87;
        }
        .dash-header:after {
          content: '';
          position: absolute;
          right: 24px; top: 11px;
          width: 32px; height: 32px;
          background: url('https://em-content.zobj.net/source/microsoft-teams/337/rock_1faa8.png') no-repeat center/contain;
          filter: drop-shadow(2px 4px 2px #3b2d1a);
          opacity: 0.82;
        }
        .dash-title {
          font-size: 2.1rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-shadow: 1px 2px #433416, 2px 4px 8px #79631c;
        }
        .user-info-block {
          background: linear-gradient(95deg, #f3edcb 60%, #eadb9a 100%);
          border: 3.5px solid #a7924c;
          border-radius: 16px 25px 18px 21px;
          box-shadow: 0 3px 20px #bfa96a38;
          padding: 14px 26px 10px 20px;
          min-width: 220px;
          margin-left: 32px;
          font-family: 'Pirata One', cursive;
          color: #614713;
          display: flex;
          flex-direction: column;
        }
        .user-info-block .user-name {
          font-size: 1.2rem;
          font-weight: 600;
        }
        .user-info-block .user-username {
          font-size: 0.93rem;
          color: #94894c;
          margin-top: 1.5px;
          font-family: 'Press Start 2P', 'Pirata One', cursive;
          letter-spacing: 1.1px;
        }
        .adventure-panel {
          border-radius: 28px 28px 38px 38px;
          background: #b6a077 url('https://www.transparenttextures.com/patterns/wood-pattern.png');
          border: 7px solid #574d32;
          box-shadow: 0 0 32px #000b;
          padding: 40px 30px 24px 30px;
          font-family: 'Pirata One', 'Press Start 2P', cursive, monospace;
          margin: 0 auto;
          margin-top: 28px;
          width: 96%;
          max-width: 1080px;
        }
        @media (max-width: 750px) {
          .dash-header { padding: 0 10px; font-size: 1.2rem; }
          .adventure-panel { padding: 20px 6px 16px 8px; }
        }
      `}</style>
      {/* Header */}
      <header className="dash-header">
        <span className="dash-title">📊 Dashboard</span>
        <div className="user-info-block">
          <div className="user-name">
            {person
              ? `${person.firstName} ${person.lastName}`
              : "Sin información personal"}
          </div>
          <div className="user-username">{user?.username}</div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main style={{ flex: 1 }}>
        <AssistanceStatsDashboard />
        <ScoreManager />
      </main>
    </div>
  );
};

export default Dashboard;
