const DELIVERY_TYPE_CHARGES = {
  sameDay: 200,
  overnight: 120,
  standard: 60,
};
const NATIONAL_CATEGOTY_CHARGES = {
  document: -100,
  electronics: 150,
  fragile: 200,
  clothing: 0,
  food: 70,
  medicine: 90,
  cosmetics: 80,
  books: 35,
  small_package: 100,
  large_package: 180,
};

const INTERNATIONAL_CATEGOTY_CHARGES = {
  document: 700,
  electronics: 2000,
  fragile: 2800,
  clothing: 500,
  food: 1750,
  medicine: 1900,
  cosmetics: 1000,
  books: 700,
  small_package: 1300,
  large_package: 4000,
};

export const calculateCost = ({
  originCity,
  destinationCity,
  shipmentType,
  parcelCategory,
  weight,
  deliverType,
}) => {
  const isSameCity =
    originCity.trim().toLowerCase() === destinationCity.trim().toLowerCase();
  const deliverTypeCharge = DELIVERY_TYPE_CHARGES[deliverType] || 0;

  // National Cost Calucation
  if (shipmentType === "national") {
    const categoryCharge = NATIONAL_CATEGOTY_CHARGES[parcelCategory] || 0;
    // 1.1 Same City To City Delivery
    if (isSameCity) {
      const basePrice = 50;
      const weightPrice = weight * 500;
      const price =
        basePrice + weightPrice + categoryCharge + deliverTypeCharge;
      return {
        type: "National_same_city",
        parcelCategory,
        price,
      };
    }
    // 1.2 Out Of City Delivery
    const basePrice = 100;
    const weightPrice = weight * 500;
    const price = basePrice + weightPrice + categoryCharge + deliverTypeCharge;
    return {
      type: "National_out_of_city",
      parcelCategory,
      price,
    };
  }

  // InterNational Cost Calucation
  if (shipmentType === "international") {
    const categoryCharge = INTERNATIONAL_CATEGOTY_CHARGES[parcelCategory] || 0;
    if (weight <= 0) {
      throw new Error("Weight must be greater than 0");
    }
    let price;
    if (weight <= 0.5) {
      price = 7500;
    } else if (weight <= 1) {
      price = 13500;
    } else {
      const extraKg = Math.ceil(weight - 1);
      price = 13500 + extraKg * 7500;
    }

    price += categoryCharge;
    return {
      type: "International",
      parcelCategory,
      price,
    };
  }

  throw new Error("Invalid shipment configuration");
};
