import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

const PromoModal = ({ isOpen, onClose, onSave, loading, promo }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    promoType: "Bonus",
    isActive: true,
    expiresAt: "",
  });

  useEffect(() => {
    if (promo) {
      setFormData({
        title: promo.title || "",
        description: promo.description || "",
        promoType: promo.promoType || "Bonus",
        isActive: promo.isActive !== undefined ? promo.isActive : true,
        expiresAt: promo.expiresAt
          ? new Date(promo.expiresAt).toISOString().slice(0, 16)
          : "",
      });
    } else {
      // Reset form when opening for creation
      setFormData({
        title: "",
        description: "",
        promoType: "Bonus",
        isActive: true,
        expiresAt: "",
      });
    }
  }, [promo, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      expiresAt: formData.expiresAt
        ? new Date(formData.expiresAt).toISOString()
        : null,
    };
    onSave(dataToSave);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={promo ? "Edit Promotion" : "Create Promotion"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Promotion Title"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows="4"
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          required
        ></textarea>
        <select
          name="promoType"
          value={formData.promoType}
          onChange={handleChange}
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="Bonus">Bonus</option>
          <option value="FreeBet">Free Bet</option>
          <option value="OddsBoost">Odds Boost</option>
        </select>
        <Input
          name="expiresAt"
          type="datetime-local"
          value={formData.expiresAt}
          onChange={handleChange}
        />
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="form-checkbox h-5 w-5"
          />
          <span className="ml-2 text-gray-700 dark:text-gray-300">Active</span>
        </label>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {promo ? "Save Changes" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PromoModal;
