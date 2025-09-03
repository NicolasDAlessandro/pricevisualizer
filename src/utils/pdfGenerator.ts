import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/LOGO.png";
import instagramIcon from "../assets/instagram.png";
import whatsappIcon from "../assets/whatsapp.png";
import locationIcon from "../assets/local.png";
import web from "../assets/web.png";

export type PresupuestoItem = {
  nombre: string;
  cuotas: number;
  montoCuota: number;
  total: number;
};
export type ProductoItem = {
  detalle: string;
  precio: number;
  qty: number;
};

export const generarPDF = async (
  items: ProductoItem[],  
  presupuesto: PresupuestoItem[],
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // ---  Logo encabezado
  doc.addImage(logo, "PNG", 0, 0, pageWidth, 40);

  // --- Línea bajo logo
  doc.setDrawColor(22, 160, 133);
  doc.setLineWidth(1.2);
  doc.line(0, 42, pageWidth, 42);

  // ---  Fecha debajo del logo
  const fecha = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.text(`${fecha}`, pageWidth - 14, 50, { align: "right" });

  // --- Título centrado
  doc.setFontSize(18);
  doc.text("Presupuesto", pageWidth / 2, 60, { align: "center" });

  // ---  Tabla de productos
  const productRows = items.map((it) => [
    it.detalle,
    `$${it.precio.toFixed(2)}`,
    it.qty,
    `$${(it.precio * it.qty).toFixed(2)}`,
  ]);

  autoTable(doc, {
    head: [["Producto", "Precio", "Cantidad", "Subtotal"]],
    body: productRows,
    startY: 70,
    theme: "grid",
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    styles: {
      fontSize: 11,
      halign: "center",
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  // ---  Tabla de formas de pago
  const paymentRows = presupuesto.map((p) => [
    p.nombre,
    p.cuotas,
    `$${p.montoCuota.toFixed(2)}`,
    `$${p.total.toFixed(2)}`,
  ]);

  autoTable(doc, {
    head: [["Forma de pago", "Cuotas", "Monto cuota", "Total"]],
    body: paymentRows,
    theme: "grid",
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    styles: {
      fontSize: 11,
      halign: "center",
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  // FOOTER
  const footerHeight = 20;
  const footerY = pageHeight - footerHeight;
  const iconSize = 4.5; 

  // Línea divisoria superior
  doc.setDrawColor(22, 160, 133);
  doc.setLineWidth(1);
  doc.line(0, footerY, pageWidth, footerY);

  // Fuente reducida
  doc.setFontSize(8);

  // --- Distribución en 4 columnas iguales
  const colWidth = pageWidth / 4;

  const addFooterItem = (
    icon: string,
    text: string,
    colIndex: number
  ) => {
    const startX = colWidth * colIndex + 10; 
    const iconY = footerY + 6;
    const textY = footerY + 9;

    doc.addImage(icon, "PNG", startX, iconY, iconSize, iconSize);

    doc.text(text, startX + iconSize + 2, textY); 
  };

  // --- Dirección
  addFooterItem(locationIcon, "Av. Pres. Perón 3832, Rosario", 0);

  // --- WhatsApp
  addFooterItem(whatsappIcon, "+54 9 341 623-3382", 1);

  // --- Instagram
  addFooterItem(instagramIcon, "@gaslonihogar", 2);

  // --- Web
  addFooterItem(web, "www.gasloni.com.ar", 3);

  // Guardar
  doc.save("presupuesto.pdf");
};
