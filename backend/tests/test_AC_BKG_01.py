# test ของ T-03: จองคิวสำเร็จ
# AC-BKG-01 (FR-BKG-04)
from app.db.models import Booking, Slot
from tests.conftest import AUTH


def test_AC_BKG_01(client, make_slot):
    """AC-BKG-01: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง จองแล้วต้องสำเร็จ"""
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201


# TC-BKG-01-1
# Given: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
# When: ยืนยันการจอง
# Then: บันทึกสำเร็จ; แสดงหมายเลขคิว; ที่นั่งว่างของช่วงนั้นเป็น 0

def test_TC_BKG_01_1_booking_success_last_seat(client, db, make_slot):
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201
    body = res.json()
    assert body["slot_id"] == slot.id
    assert body["queue_no"]
    assert body["queue_no"] == "A001"

    db.refresh(slot)
    assert slot.remaining == 0
    assert db.query(Booking).count() == 1


# TC-BKG-01-2
# Given: ยืนยันตัวตนแล้ว และช่วง 09.00 น. อยู่ที่จุดว่างสุดท้ายเพียง 1 ที่ก่อนยืนยัน
# When: ยืนยันการจอง
# Then: บันทึกสำเร็จ; แสดงหมายเลขคิว; ที่นั่งว่างของช่วงนั้นเปลี่ยนจาก 1 เป็น 0

def test_TC_BKG_01_2_last_seat_becomes_zero(client, db, make_slot):
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201
    assert res.json()["queue_no"] == "A001"

    db.refresh(slot)
    assert slot.remaining == 0
    current = db.get(Slot, slot.id)
    assert current.remaining == 0


# TC-BKG-01-3
# Given: ผู้รับบริการยังไม่ยืนยันตัวตน หรือข้อมูลยืนยันตัวตนไม่ผ่านก่อนเข้าจอง
# When: พยายามยืนยันการจองช่วง 09.00 น.
# Then: ไม่บันทึกการจอง; ไม่ตัดที่นั่ง; ไม่แสดงหมายเลขคิวตาม FR-BKG-04 และ IF-IDP-01

def test_TC_BKG_01_3_unverified_user_rejected(client, db, make_slot):
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers={})

    assert res.status_code == 401
    assert res.json()["detail"] == "ยังไม่ได้ยืนยันตัวตน"

    db.refresh(slot)
    assert slot.remaining == 1
    assert db.query(Booking).count() == 0
