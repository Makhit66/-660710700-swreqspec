# RTM: จองคิวตรวจสุขภาพ (Booking)
อ้างอิง: spec.md SPEC-BKG-001 Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-10-07 08:31:09 | test: 8 ผ่าน 0 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-BKG-01 | AC-BKG-05 (ตรวจความเร็ว ไม่ใช่ผลข้อมูล) | T-02 | backend/app/slots/service.py: list_available_slots; backend/app/slots/router.py: get_slots | backend/tests/test_AC_BKG_05.py: passed | ช่องโหว่ |
| FR-BKG-02 | AC-BKG-02 | T-04 | backend/app/booking/service.py: create_booking | ไม่พบ test ใน repo (ยังไม่ได้สร้าง) | ช่องโหว่ |
| FR-BKG-03 | AC-BKG-03 | T-05, T-11, T-12 | backend/app/booking/router.py: create_booking; backend/app/slots/service.py: list_available_slots | ไม่มี test หน้า/หลังบ้านที่ตรวจ 3 ตัวเลือกที่ใกล้ที่สุด | ช่องโหว่ |
| FR-BKG-04 | AC-BKG-01 | T-03, T-06 | backend/app/booking/service.py: create_booking; backend/app/booking/router.py: create_booking | backend/tests/test_AC_BKG_01.py: 4 passed | ช่องโหว่ |
| FR-BKG-05 | AC-BKG-04 | T-07 | ไม่มีไฟล์ notify/queue.py หรือ retry logic | ไม่มี test ใน repo | ช่องโหว่ |
| FR-BKG-06 | ไม่มี AC | T-02, T-10 | backend/app/slots/service.py: list_available_slots | ไม่มี test ของแพ็กเกจที่สลับแบบจริง | ครบ |
| NFR-PERF-01 | AC-BKG-05 | T-02 | backend/app/slots/service.py: list_available_slots | backend/tests/test_AC_BKG_05.py: passed | ครบ |
| NFR-SEC-01 | ไม่มี AC | ไม่มี task | ไม่มี HTTPS/TLS configuration ในโค้ด | ไม่มี test | ยังไม่ถึง |
| NFR-REL-02 | AC-BKG-04 | T-07 | ไม่มี retry queue หรือ scheduler | ไม่มี test | ยังไม่ถึง |
| NFR-USE-01 | ไม่มี AC | ไม่มี task | ไม่มี end-to-end flow หรือ UI flow | ไม่มี test | ยังไม่ถึง |
| CON-TECH-01 | ไม่มี AC | T-01 | backend/app/config.py: DATABASE_URL; backend/app/db/session.py: engine | ไม่มี test เฉพาะ PostgreSQL แต่ config รองรับ env var | ครบ |
| DOM-PDPA-01 | AC-BKG-06 | T-08 | backend/app/db/models.py: AuditLog; backend/app/main.py: app (ไม่มี middleware) | backend/tests/test_AC_BKG_06.py: ไม่มีไฟล์ | ช่องโหว่ |
| IF-IDP-01 | ไม่มี AC (อ้างจาก Constraint) | T-03 | backend/app/auth/idp.py: get_verified_hn | ไม่พบ test เฉพาะ IF-IDP-01 แต่ AC-BKG-01 ใช้ header สมมุติ | ครบ |
| IF-HIS-01 | ไม่มี AC | T-09 | backend/app/db/models.py: Booking เก็บ hn เท่านั้น; ไม่มี his/client.py | ไม่มี test ให้ตรวจ | ยังไม่ถึง |
| IF-NOT-01 | AC-BKG-04 | T-07 | ไม่มี async queue หรือ notification sender | ไม่มี test ให้ตรวจ | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| backend/app/slots/router.py: GET /slots | FR-BKG-01, FR-BKG-06 | ไม่ครบ | คืนเฉพาะช่วงที่มีที่นั่ง แต่จำกัด 14 วัน เท่านั้น ไม่ตรง FR-BKG-01 ที่ต้องการ 30 วัน และไม่มี test ตรวจจำนวนวันที่ถูกต้อง |
| backend/app/slots/service.py: list_available_slots | FR-BKG-01, FR-BKG-06 | ไม่ครบ | `DAYS_AHEAD = 14` เป็นการตัดสินใจแทนทีม ไม่ได้มาจาก spec และไม่แสดงคำสั่งให้เลือก 3 ตัวเลือกหรือคำนวณตามแพ็กเกจ 30 วัน |
| backend/app/booking/service.py: create_booking | FR-BKG-02, FR-BKG-04 | ไม่ครบ | ไม่มีตรวจว่ามีคิววันเดียวกันที่ยังไม่ได้ใช้ก่อนจอง และไม่มีการส่งข้อความยืนยันแบบ async |
| backend/app/booking/router.py: POST /bookings | FR-BKG-03, FR-BKG-04, IF-IDP-01 | ไม่ครบ | คืน 409 เมื่อเต็ม แต่ไม่มีการเสนอ 3 ตัวเลือกที่ใกล้เคียง และยังไม่มีลำดับการคงคิวเมื่อยืนยันเสร็จ |
| backend/app/auth/idp.py: get_verified_hn | IF-IDP-01 | ครบ | ตรวจ `Authorization` แบบ `******` และ 401 ถ้ายังไม่ยืนยันตัวตน ตาม spec |
| backend/app/db/models.py: Booking, AuditLog | IF-HIS-01, DOM-PDPA-01 | ไม่ครบ | เก็บ `hn` เท่านั้น แต่ไม่มี HIS lookup และไม่มี audit log ที่ถูกเขียนจริงระหว่างการเข้าถึงข้อมูล |
| backend/app/config.py: DATABASE_URL | CON-TECH-01 | ครบ | รองรับ PostgreSQL ผ่าน env var ตามมาตรฐานฝ่าย IT แม้ทดสอบใช้ SQLite ใน-memory |
| backend/app/booking/service.py: next_queue_no | FR-BKG-04, Q-02 | ไม่ครบ | ออกเลขคิวแบบ `A001` เป็นการเดาโดยไม่รอคำตอบ Q-02 จากเจ้าหน้าที่เวชระเบียน |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | ตัวเลขไม่ตรง spec | backend/app/slots/service.py: list_available_slots | FR-BKG-01 | โค้ดกำหนด `DAYS_AHEAD = 14` แทนที่จะเป็น 30 วันข้างหน้า จึงไม่แสดงช่วงเวลาทั้งหมดตาม spec |  |
| F-002 | โค้ดไม่มี FR | backend/app/booking/service.py: create_booking | FR-BKG-02 | ไม่มีการตรวจว่าผู้รับบริการมีคิวที่ยังไม่ได้ใช้ในวันเดียวกันก่อนยืนยัน จึงอนุญาตการจองซ้ำได้ |  |
| F-003 | โค้ดไม่มี FR | backend/app/booking/router.py: create_booking; backend/app/slots/service.py: list_available_slots | FR-BKG-03 | เมื่อช่วงเวลาที่เลือกเต็ม ไม่มีการเสนอ 3 ตัวเลือกที่ใกล้เวลาเลือกที่สุดภายในวันเดียวกันและวันถัดไป |  |
| F-004 | โค้ดไม่มี FR | backend/app/booking/service.py; backend/app/booking/router.py; โฟลเดอร์ backend/app/notify/ ไม่มีอยู่จริง | FR-BKG-04, IF-NOT-01 | การสร้างการจองทำสำเร็จแต่ไม่มีการวางงานส่งข้อความยืนยันแบบ asynchronous และไม่มีคิวส่งซ้ำ หรือ requeue |  |
| F-005 | โค้ดไม่มี FR | backend/app/booking/service.py; ไม่มี retry queue | FR-BKG-05, NFR-REL-02 | ถ้าการส่งข้อความยืนยันล้ม ไม่มีการคงการจองและไม่มี retry ภายใน 5 นาทีตาม ASM-03 |  |
| F-006 | ละเมิด Constraint | backend/app/main.py; backend/app/db/models.py; ไม่มี audit middleware | DOM-PDPA-01 | ตาราง audit_logs มีอยู่ แต่ไม่มี code ที่บันทึก audit log ทุกครั้งที่เข้าถึงข้อมูลการจอง (actor_id, เวลา, hn) |  |
| F-007 | เดา Q-xx | backend/app/booking/service.py: next_queue_no | FR-BKG-04, Q-02 | โค้ดกำหนดรูปแบบคิวเป็น `A001` อย่างไม่รอคำตอบจากเจ้าหน้าที่เวชระเบียน จึงเดาแทน Q-02 |  |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
