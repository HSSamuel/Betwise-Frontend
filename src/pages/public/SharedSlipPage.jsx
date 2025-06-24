import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { getSharedSlip } from "../../services/betService";
import { useBetSlip } from "../../contexts/BetSlipContext";
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

const SharedSlipPage = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const { addSelection } = useBetSlip();
  const { data, loading, error, request: fetchSlip } = useApi(getSharedSlip);
  const [slipDetails, setSlipDetails] = useState(null);

  useEffect(() => {
    if (shareId) {
      fetchSlip(shareId);
    }
  }, [shareId, fetchSlip]);

  useEffect(() => {
    if (data) {
      setSlipDetails(data.slip);
    }
  }, [data]);

  const handleAddSelectionsToSlip = () => {
    if (slipDetails?.selections) {
      slipDetails.selections.forEach((selection) => {
        const game = selection.gameId; // The game object is populated from the backend
        addSelection({
          gameId: game._id,
          gameDetails: { homeTeam: game.homeTeam, awayTeam: game.awayTeam },
          outcome: selection.outcome,
          odds: game.odds[selection.outcome.toLowerCase()],
        });
      });
      toast.success("Selections added to your bet slip!");
      navigate("/"); // Navigate to home page to see the populated slip
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!slipDetails) return null;

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <h1 className="text-2xl font-bold mb-4 text-center">Shared Bet Slip</h1>
        <div className="space-y-3">
          {slipDetails.selections.map((selection, index) => (
            <div
              key={index}
              className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md"
            >
              <p className="font-semibold">
                {selection.gameId.homeTeam} vs {selection.gameId.awayTeam}
              </p>
              <p className="text-sm text-gray-500">
                Pick: <span className="font-bold">{selection.outcome}</span>
              </p>
            </div>
          ))}
        </div>
        <Button onClick={handleAddSelectionsToSlip} className="w-full mt-6">
          Add to My Bet Slip
        </Button>
      </Card>
    </div>
  );
};

export default SharedSlipPage;
