// Utility functions
export const formatPrice = (price) => {
  return `R${price.toFixed(2)}`;
};

export const getImagePath = (imageName) => {
  return `/images/${imageName}`;
};

export const generateWhatsAppMessage = (cart, total) => {
  let message = "Hi Laureta Scents! I'd like to order:\n\n";
  
  cart.forEach(item => {
    message += `${item.name}`;
    if (item.variant?.scent) message += ` (${item.variant.scent})`;
    if (item.variant?.size) message += ` - ${item.variant.size}`;
    message += ` x ${item.quantity} - R${(item.price * item.quantity).toFixed(2)}\n`;
  });
  
  message += `\nTotal: R${total}\n\n`;
  message += "My Details:\nName: \nAddress: \nPhone: ";
  
  return message;
};