import React, { useEffect } from "react";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";
import { useApi } from "../../hooks/useApi";
import { getGameDetails } from "../../services/gameService";
import { FaFutbol, FaRegSquare, FaExchangeAlt } from "react-icons/fa";

const EventIcon = ({ type }) => {
  switch (type) {
    case "Goal":
      return <FaFutbol className="text-green-500" />;
    case "Card":
      return <FaRegSquare className="text-yellow-500" />;
    case "subst":
      return <FaExchangeAlt className="text-blue-500" />;
    default:
      return null;
  }
};

const GameDetailsModal = ({ isOpen, onClose, game }) => {
  const {
    data: details,
    loading,
    error,
    request: fetchDetails,
  } = useApi(getGameDetails);

  useEffect(() => {
    if (isOpen && game?._id) {
      fetchDetails(game._id);
    }
  }, [isOpen, game, fetchDetails]);

  const renderContent = () => {
    if (loading) return <Spinner />;
    if (error) return <p className="text-red-500 text-center">{error}</p>;
    if (!details) return null;

    return (
      <div>
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold">
            {details.scores.home} - {details.scores.away}
          </h2>
          <p className="text-gray-500">Final Score</p>
        </div>
        <h4 className="font-bold mb-3">Match Events</h4>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {details.events && details.events.length > 0 ? (
            details.events.map((event, index) => (
              <div key={index} className="flex items-center text-sm">
                <div className="w-8 text-center">
                  <EventIcon type={event.type} />
                </div>
                <div className="w-12 font-bold">{event.time.elapsed}'</div>
                <div className="flex-1">
                  <p className="font-semibold">{event.player.name}</p>
                  <p className="text-xs text-gray-400">{event.detail}</p>
                </div>
                <div className="font-semibold">{event.team.name}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">
              No event data available.
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${game?.homeTeam} vs ${game?.awayTeam}`}
    >
      {renderContent()}
    </Modal>
  );
};

export default GameDetailsModal;
