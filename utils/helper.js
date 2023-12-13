const calculateTotals = (data) => {

    let totalCost = 0;
    let totalProfit = 0;
    let totalDiscount = 0;
    let totalSellingPrice = 0;
  

    const totals = data.reduce((acc, item) => {

      const cost = parseFloat(item.cost);
      const profit = parseFloat(item.profit);
      const discount = parseFloat(item.discount);
      const sellingPrice = parseFloat(item.sellingPrice);
  

      acc.totalCost += cost;
      acc.totalProfit += profit;
      acc.totalDiscount += discount;
      acc.totalSellingPrice += sellingPrice;
  
      return acc;
    }, {
      totalCost: 0,
      totalProfit: 0,
      totalDiscount: 0,
      totalSellingPrice: 0,
    });
  
    totalCost = totals.totalCost;
    totalProfit = totals.totalProfit;
    totalDiscount = totals.totalDiscount;
    totalSellingPrice = totals.totalSellingPrice;
  

    return {
      totalCost,
      totalProfit,
      totalDiscount,
      totalSellingPrice,
    };
  }

module.exports = {calculateTotals}