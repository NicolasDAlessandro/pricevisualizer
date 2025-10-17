import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/LOGO.png";
import instagramIcon from "../assets/instagram.png";
import whatsappIcon from "../assets/whatsapp.png";
import locationIcon from "../assets/local.png";
import web from "../assets/web.png";

import { formatCurrency } from "../utils/formatCurrency";

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
export type PresupuestoPorProducto = {
  producto: string;
  opciones: PresupuestoItem[];
};

export const generarPDF = async (
  items: ProductoItem[],
  presupuesto: PresupuestoItem[] | PresupuestoPorProducto[],
  seller?: { nombre: string; apellido: string;},
  cliente?: string,
  observaciones?: string,
  entrega?: number, 
  presupuestoId?: number
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // --- Logo encabezado
  doc.addImage(logo, "PNG", 0, 0, pageWidth, 40);

  // --- Línea bajo logo
  doc.setDrawColor(22, 160, 133);
  doc.setLineWidth(1.2);
  doc.line(0, 42, pageWidth, 42);

  // --- Fecha debajo del logo
  const fecha = new Date().toLocaleDateString("es-AR");
  doc.setFontSize(10);
  doc.text(`${fecha} - Válido por 7 días`, pageWidth - 14, 50, { align: "right" });
  
  // --- Vendedor
  if (seller) {
    doc.setFontSize(10);
    doc.text(
      `Vendedor: ${seller.nombre} ${seller.apellido} `,
      14,
      50
    );
  }

    // --- Entrega
  if (typeof entrega === "number" && entrega > 0) {
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Entrega : $${entrega.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
      })}`,
      pageWidth - 14,
      57,
      { align: "right" }
    );
    doc.setTextColor(0, 0, 0); 
  }

  // --- Cliente
   if (cliente) {
    doc.text(`Hola: ${cliente}`, 14, 57);
  }

  // --- Título centrado
  doc.setFontSize(18);
  doc.text("Presupuesto", pageWidth / 2, 60, { align: "center" });

  // --- Tabla de productos
  const productRows = items.map((it) => [
    it.detalle,
    it.qty,
  ]);



  autoTable(doc, {
    head: [["Producto", "Cantidad"]],
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


  // Detectar tipo de presupuesto
  const esIndividual = (presupuesto as PresupuestoPorProducto[])[0]?.opciones !== undefined;

  if (!esIndividual) {
    // Presupuesto general
    const paymentRows = (presupuesto as PresupuestoItem[]).map((p) => [
      p.nombre,
      p.cuotas,
      `$${formatCurrency(p.montoCuota)}`,
      `$${formatCurrency(p.total)}`,
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
  } else {
    // Presupuesto individual por producto
    let lastY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 20 : 80;

    (presupuesto as PresupuestoPorProducto[]).forEach((grupo) => {
      if ((doc as any).lastAutoTable && (doc as any).lastAutoTable.finalY + 60 > pageHeight) {
        doc.addPage();
        lastY = 40; 
      } else {
        lastY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 20 : 80;
      }

      // Título del producto
      doc.setFontSize(14);
      doc.text(`${grupo.producto}`, pageWidth / 2, lastY, {
        align: "center",
      });

      const paymentRows = grupo.opciones.map((p) => [
        p.nombre,
        p.cuotas,
        `$${formatCurrency(p.montoCuota)}`,
        `$${formatCurrency(p.total)}`,
      ]);

      autoTable(doc, {
        head: [["Forma de pago", "Cuotas", "Monto cuota", "Total"]],
        body: paymentRows,
        startY: lastY + 10,
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
    });
  }
  // --- Observaciones
  
  if (observaciones) {
    let lastY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 15 : pageHeight - 40;
    doc.setFontSize(11);
    doc.text("Observaciones:", 14, lastY);
    doc.setFontSize(10);
    doc.text(observaciones, 14, lastY + 6);
  }

  // --- FOOTER
  const footerHeight = 20;
  const footerY = pageHeight - footerHeight;
  const iconSize = 4.5;
  doc.setDrawColor(22, 160, 133);
  doc.setLineWidth(1);
  doc.line(0, footerY, pageWidth, footerY);

  doc.setFontSize(8);
  const colWidth = pageWidth / 4;

  const addFooterItem = (icon: string, text: string, colIndex: number) => {
    const startX = colWidth * colIndex + 10;
    const iconY = footerY + 6;
    const textY = footerY + 9;

    doc.addImage(icon, "PNG", startX, iconY, iconSize, iconSize);
    doc.text(text, startX + iconSize + 2, textY);
  };

  addFooterItem(locationIcon, "Av. Pres. Perón 3832, Rosario", 0);
  addFooterItem(whatsappIcon, "+54 9 341 623-3382", 1);
  addFooterItem(instagramIcon, "@gaslonihogar", 2);
  addFooterItem(web, "www.gasloni.com.ar", 3);

  doc.save('Presupuesto' + (presupuestoId ? `_${presupuestoId}` : '') + '.pdf');
};
