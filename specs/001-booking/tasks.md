# Tasks: จองคิวตรวจสุขภาพ (Booking)
Feature: จองคิวตรวจสุขภาพ (Booking)
Spec ID: SPEC-BKG-001
อ้างอิง plan.md: specs/001-booking/plan.md
วันที่: 2569-09-23

งานนี้แยกเป็น 12 task
มี 1 task ที่ต้องรอ Open Question (Q-02) และ 11 task พร้อมทำตาม spec v2

### T-01 สร้าง schema และ migration ฐานข้อมูล
- รองรับ: CON-TECH-01, DOM-PDPA-01, IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-01
- ไฟล์ที่แตะ: backend/app/db/models.py, backend/app/db/migrations/001_init.py, backend/app/config.py
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: migration สร้างตาราง slots, bookings, audit_logs และตั้งค่า PostgreSQL สำหรับระบบจริงพร้อมใช้งาน
- สถานะ: เสร็จ รอทีมตรวจ

### T-02 สร้าง API ค้นช่วงเวลาว่างและคำนวณ slot ที่เหลือ
- รองรับ: FR-BKG-01, FR-BKG-06, NFR-PERF-01
- ตรวจด้วย: AC-BKG-05
- ไฟล์ที่แตะ: backend/app/slots/router.py, backend/app/slots/service.py, backend/tests/test_slots.py
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: GET /slots คืนค่าช่วงเวลาใน 30 วันข้างหน้า พร้อมจำนวนที่นั่งคงเหลือ และประสิทธิภาพ p95 ตรงตาม NFR-PERF-01
- สถานะ: พร้อมทำ

### T-03 สร้างการจองแบบพื้นฐานและตัดจำนวนที่นั่ง
- รองรับ: FR-BKG-04, FR-BKG-01
- ตรวจด้วย: AC-BKG-01
- ไฟล์ที่แตะ: backend/app/booking/router.py, backend/app/booking/service.py, backend/tests/test_booking_success.py
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: POST /bookings บันทึกการจองได้สำเร็จ ตัด remaining ของ slot เป็น 0 และส่งกลับหมายเลขคิวแบบเบื้องต้น
- สถานะ: พร้อมทำ

### T-04 ป้องกันการจองซ้ำในวันเดียวกัน
- รองรับ: FR-BKG-02
- ตรวจด้วย: AC-BKG-02
- ไฟล์ที่แตะ: backend/app/booking/service.py, backend/tests/test_booking_duplicate.py
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: มีคิวที่ยังไม่ได้ใช้ในวันเดียวกัน จะถูกปฏิเสธการจองใหม่ และได้หมายเลขคิวเดิมกลับคืน
- สถานะ: พร้อมทำ

### T-05 จัดการช่วงเวลาเต็มและเสนอ 3 ตัวเลือกที่ใกล้ที่สุด
- รองรับ: FR-BKG-03
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: backend/app/slots/service.py, backend/app/booking/service.py, backend/tests/test_booking_full_slot.py
- ต้องทำหลัง: T-02, T-03, T-04
- เสร็จเมื่อ: เมื่อช่วงเวลาที่เลือกเต็ม ระบบคืน 409 พร้อม 3 ช่วงว่างที่ใกล้ที่สุดในวันเดียวกันและวันถัดไป โดยไม่ให้มีการจองซ้อน
- สถานะ: พร้อมทำ

### T-06 สร้างคิวส่งข้อความแบบ asynchronous และการส่งซ้ำ
- รองรับ: FR-BKG-05, IF-NOT-01, NFR-REL-02
- ตรวจด้วย: AC-BKG-04
- ไฟล์ที่แตะ: backend/app/notify/queue.py, backend/app/booking/service.py, backend/tests/test_notify_retry.py
- ต้องทำหลัง: T-03, T-05
- เสร็จเมื่อ: การจองยังถูกบันทึกแม้ส่งข้อความไม่สำเร็จ และมีรายการคิวส่งซ้ำที่ต้องส่งภายใน 5 นาที
- สถานะ: พร้อมทำ

### T-07 เพิ่ม audit log และตรวจสอบการเข้าถึงข้อมูลการจอง
- รองรับ: DOM-PDPA-01
- ตรวจด้วย: AC-BKG-06
- ไฟล์ที่แตะ: backend/app/audit/middleware.py, backend/app/booking/router.py, backend/tests/test_audit_log.py
- ต้องทำหลัง: T-01, T-03
- เสร็จเมื่อ: ทุกการเข้าถึงข้อมูลการจองมี audit log ที่ระบุผู้เข้าถึง เวลา และ hn และ record ถูกจัดเก็บอย่างน้อย 1 ปี
- สถานะ: พร้อมทำ

### T-08 ตรวจผลยืนยันตัวตนและค้น HN จาก HIS ก่อนใช้งาน
- รองรับ: IF-IDP-01, IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-08
- ไฟล์ที่แตะ: backend/app/auth/idp.py, backend/app/his/client.py, backend/app/booking/router.py
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: ทุก endpoint ที่เข้าถึงข้อมูลผู้รับบริการตรวจว่ามีผลยืนยันตัวตนแล้ว และการค้น HN จาก HIS เก็บเฉพาะ HN ไม่เก็บเลขบัตรประชาชน
- สถานะ: พร้อมทำ

### T-09 สร้างหน้าจอเลือกแพ็กเกจและช่วงเวลา
- รองรับ: FR-BKG-01, FR-BKG-06
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-09
- ไฟล์ที่แตะ: frontend/src/pages/SlotPicker.jsx, frontend/src/App.jsx, frontend/src/__tests__/slot-picker.test.jsx
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: ผู้ใช้เลือกแพ็กเกจและดูช่วงเวลาว่างพร้อมจำนวนที่นั่งคงเหลือได้ตามสัญญา API จำลอง
- สถานะ: เสร็จ รอทีมตรวจ

### T-10 สร้างหน้้ายืนยันและจัดการกรณีช่วงเต็ม
- รองรับ: FR-BKG-03, FR-BKG-04
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: frontend/src/pages/ConfirmBooking.jsx, frontend/src/__tests__/AC-BKG-03.test.jsx
- ต้องทำหลัง: T-09
- เสร็จเมื่อ: หน้ายืนยันแสดงข้อความ “ช่วงเวลาเต็ม” พร้อม 3 ตัวเลือกที่ใกล้ที่สุด และสามารถยืนยันเมื่อช่วงว่างแล้ว
- สถานะ: พร้อมทำ

### T-11 สร้างการออกหมายเลขคิวและแสดงบนหน้าผลลัพธ์
- รองรับ: FR-BKG-04, FR-BKG-05
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-11
- ไฟล์ที่แตะ: backend/app/booking/service.py, frontend/src/pages/BookingResult.jsx, backend/tests/test_queue_no.py
- ต้องทำหลัง: T-03, T-06
- เสร็จเมื่อ: หมายเลขคิวถูกออกและแสดงผลตามรูปแบบที่ได้รับคำตอบจาก Q-02 พร้อมให้ผู้ใช้เห็นบนหน้าจอแม้ส่งข้อความไม่สำเร็จ
- สถานะ: รอ Q-02

### T-12 ต่อหน้าจอกับ API จริงและตรวจสอบความครบของฟีเจอร์
- รองรับ: FR-BKG-01, FR-BKG-03, FR-BKG-04, FR-BKG-05
- ตรวจด้วย: AC-BKG-01, AC-BKG-03, AC-BKG-04
- ไฟล์ที่แตะ: frontend/src/api/client.js, frontend/src/App.jsx, frontend/src/pages/*
- ต้องทำหลัง: T-02, T-05, T-06, T-09, T-10
- เสร็จเมื่อ: หน้าจอเรียก API จริงได้ถูกต้อง และทุก flow หลักและ exception ของ UC-01 ทำงานต่อกันแบบ end-to-end รวมทั้งการแสดงผลการจอง
- สถานะ: พร้อมทำ

## ตารางตรวจความครบ AC
| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-BKG-01 | T-03 |
| AC-BKG-02 | T-04 |
| AC-BKG-03 | T-05, T-10 |
| AC-BKG-04 | T-06, T-12 |
| AC-BKG-05 | T-02 |
| AC-BKG-06 | T-07 |

## ตารางตรวจความครบ Constraint
| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| CON-TECH-01 | T-01 |
| DOM-PDPA-01 | T-01, T-07 |
| IF-IDP-01 | T-08 |
| IF-HIS-01 | T-01, T-08 |
| IF-NOT-01 | T-06 |

## สิ่งที่ยังไม่ทำ
- Q-02: หมายเลขคิวรีเซ็ตรายวัน หรือนับต่อเนื่อง และมีรูปแบบอย่างไร (เช่น A001)? -> ถามเจ้าหน้าที่เวชระเบียน
  - รอ: T-11
