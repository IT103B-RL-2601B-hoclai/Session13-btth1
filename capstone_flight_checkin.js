let tickets = [
  { pnr: "VN-101", customerName: "Nguyen Van A", flightNumber: "VN220", classType: "ECONOMY", baggageWeight: 0, excessFee: 0, status: "BOOKED" },
  { pnr: "VN-102", customerName: "Tran Thi B", flightNumber: "VN221", classType: "BUSINESS", baggageWeight: 0, excessFee: 0, status: "BOOKED" },
  { pnr: "VN-103", customerName: "Le Van C", flightNumber: "VN222", classType: "ECONOMY", baggageWeight: 0, excessFee: 0, status: "BOOKED" }
];

function findTicketByPnr(pnr) {
  return tickets.findIndex(item => item.pnr.toUpperCase() === pnr.toUpperCase());
}

function calculateExcessBaggageFee(classType, baggageWeight) {
  const allowance = classType === "BUSINESS" ? 30 : 20;
  if (baggageWeight > allowance) {
    return (baggageWeight - allowance) * 50000;
  }
  return 0;
}

function displayBoardingPass(ticket) {
  console.log("==========================================");
  console.log("            BOARDING PASS                 ");
  console.log("==========================================");
  console.log(` Mã PNR: ${ticket.pnr}`);
  console.log(` Hành khách: ${ticket.customerName}`);
  console.log(` Chuyến bay: ${ticket.flightNumber}`);
  console.log(` Hạng vé: ${ticket.classType}`);
  console.log(` Hành lý: ${ticket.baggageWeight} kg (Phụ thu: ${ticket.excessFee.toLocaleString("vi-VN")} VNĐ)`);
  console.log(` Trạng thái: ${ticket.status}`);
  console.log("==========================================");
}

function listTickets() {
  if (!tickets || tickets.length === 0) {
    console.log("Không có dữ liệu vé chuyến bay!");
    return;
  }
  console.log("=".repeat(95));
  console.log(
    "Mã PNR".padEnd(10) + " | " +
    "Tên Hành Khách".padEnd(20) + " | " +
    "Số Hiệu".padEnd(10) + " | " +
    "Hạng Vé".padEnd(12) + " | " +
    "Hành Lý (kg)".padStart(12) + " | " +
    "Trạng Thái".padStart(12)
  );
  console.log("-".repeat(95));
  tickets.forEach(ticket => {
    console.log(
      ticket.pnr.padEnd(10) + " | " +
      ticket.customerName.padEnd(20) + " | " +
      ticket.flightNumber.padEnd(10) + " | " +
      ticket.classType.padEnd(12) + " | " +
      String(ticket.baggageWeight).padStart(12) + " | " +
      ticket.status.padStart(12)
    );
  });
  console.log("=".repeat(95));
}

function checkIn() {
  const rawPnr = prompt("Nhập mã đặt chỗ PNR:");
  if (rawPnr === null) return;
  const pnr = rawPnr.trim().toUpperCase();
  const index = findTicketByPnr(pnr);

  if (index === -1) {
    console.log(`Không tìm thấy vé có mã PNR: ${pnr}`);
    return;
  }

  const ticket = tickets[index];
  if (ticket.status === "CANCELLED") {
    console.log("Vé này đã bị hủy, không thể check-in!");
    return;
  }
  if (ticket.status === "CHECKED_IN") {
    console.log("Hành khách này đã hoàn tất thủ tục check-in trước đó!");
    displayBoardingPass(ticket);
    return;
  }

  const rawWeight = prompt(`Nhập trọng lượng hành lý ký gửi (kg) cho khách ${ticket.customerName}:`);
  if (rawWeight === null) return;
  const weight = Number(rawWeight.trim());

  if (isNaN(weight) || weight < 0) {
    console.log("Trọng lượng hành lý không hợp lệ!");
    return;
  }

  const fee = calculateExcessBaggageFee(ticket.classType, weight);

  ticket.baggageWeight = weight;
  ticket.excessFee = fee;
  ticket.status = "CHECKED_IN";

  console.log("Check-in thành công!");
  if (fee > 0) {
    console.log(`Hành khách có hành lý vượt định mức. Phụ thu phải nộp: ${fee.toLocaleString("vi-VN")} VNĐ`);
  } else {
    console.log("Hành lý trong định mức miễn cước.");
  }
  displayBoardingPass(ticket);
}

function searchTicket() {
  const rawKey = prompt("Nhập mã PNR hoặc tên hành khách cần tra cứu:");
  if (rawKey === null || rawKey.trim() === "") {
    console.log("Chưa nhập từ khóa tìm kiếm.");
    return;
  }
  const keyword = rawKey.trim().toLowerCase();
  const results = tickets.filter(item => 
    item.pnr.toLowerCase().includes(keyword) || 
    item.customerName.toLowerCase().includes(keyword)
  );

  if (results.length === 0) {
    console.log("Không tìm thấy kết quả phù hợp.");
    return;
  }

  console.log(`Tìm thấy ${results.length} vé phù hợp:`);
  console.log("=".repeat(95));
  console.log(
    "Mã PNR".padEnd(10) + " | " +
    "Tên Hành Khách".padEnd(20) + " | " +
    "Số Hiệu".padEnd(10) + " | " +
    "Hạng Vé".padEnd(12) + " | " +
    "Hành Lý (kg)".padStart(12) + " | " +
    "Trạng Thái".padStart(12)
  );
  console.log("-".repeat(95));
  results.forEach(ticket => {
    console.log(
      ticket.pnr.padEnd(10) + " | " +
      ticket.customerName.padEnd(20) + " | " +
      ticket.flightNumber.padEnd(10) + " | " +
      ticket.classType.padEnd(12) + " | " +
      String(ticket.baggageWeight).padStart(12) + " | " +
      ticket.status.padStart(12)
    );
  });
  console.log("=".repeat(95));
}

function cancelTicket() {
  const rawPnr = prompt("Nhập mã PNR cần hủy vé:");
  if (rawPnr === null) return;
  const pnr = rawPnr.trim().toUpperCase();
  const index = findTicketByPnr(pnr);

  if (index === -1) {
    console.log(`Không tìm thấy vé có mã PNR: ${pnr}`);
    return;
  }

  const ticket = tickets[index];
  if (ticket.status === "CANCELLED") {
    console.log("Vé này đã ở trạng thái hủy từ trước.");
    return;
  }

  const confirm = prompt(`Xác nhận hủy vé ${pnr} của khách ${ticket.customerName}? Nhập 'y' để đồng ý:`);
  if (confirm === null || confirm.trim().toLowerCase() !== "y") {
    console.log("Đã hủy thao tác hủy vé.");
    return;
  }

  ticket.status = "CANCELLED";
  console.log(`Đã hủy vé thành công cho mã PNR: ${pnr}`);
}

function displayMenu() {
  console.log("HỆ THỐNG QUẢN LÝ QUẦY CHECK-IN SÂN BAY");
  console.log("1. Hiển thị danh sách vé chuyến bay");
  console.log("2. Tiếp nhận check-in & Cân hành lý");
  console.log("3. Tra cứu vé theo PNR hoặc tên hành khách");
  console.log("4. Hủy vé chuyến bay");
  console.log("5. Thoát ca làm việc");
}

function main() {
  let isRunning = true;
  do {
    displayMenu();
    const rawChoice = prompt("Nhập lựa chọn của bạn (1-5):");
    if (rawChoice === null) {
      console.log("Thoát ca làm việc. Tạm biệt!");
      break;
    }
    const choice = Number(rawChoice.trim());
    switch (choice) {
      case 1:
        listTickets();
        break;
      case 2:
        checkIn();
        break;
      case 3:
        searchTicket();
        break;
      case 4:
        cancelTicket();
        break;
      case 5:
        console.log("Thoát ca làm việc. Tạm biệt!");
        isRunning = false;
        break;
      default:
        console.log("Lựa chọn không hợp lệ. Vui lòng chọn từ 1 đến 5.");
    }
  } while (isRunning);
}

main();