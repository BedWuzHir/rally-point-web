import { beforeEach, describe, expect, it } from 'vitest'
import { demoStore } from './demoStore'

describe('demoStore inquiry workflow', () => {
  beforeEach(() => {
    localStorage.clear()
    demoStore.reset()
  })

  it('keeps inquiries private to staff and persists one Admin reply with a staff notification', () => {
    const staff = demoStore.login('staff@rallypoint.local', 'staff123')
    const inquiry = demoStore.createInquiry({
      user_id: staff.id,
      category: 'booking',
      subject: 'Schedule access',
      message: 'Please help with the schedule.',
    })

    expect(demoStore.inquiriesForUser(staff.id)).toHaveLength(1)
    expect(() => demoStore.allInquiries()).toThrow('Only admins can view all inquiries')
    expect(() =>
      demoStore.createInquiry({
        user_id: 'user_admin',
        category: 'other',
        subject: 'Not my inquiry',
        message: 'Staff cannot submit for another account.',
      }),
    ).toThrow('Only staff and admins can submit inquiries for their own account')

    const admin = demoStore.login('admin@rallypoint.local', 'admin123')
    expect(demoStore.allInquiries()).toHaveLength(1)
    const updated = demoStore.respondToInquiry({
      id: inquiry.id,
      status: 'in_progress',
      response: 'I updated your access.',
    })
    expect(updated).toMatchObject({
      status: 'in_progress',
      response: 'I updated your access.',
      responded_by: admin.id,
    })
    expect(demoStore.notifications(staff.id)).toHaveLength(1)

    demoStore.respondToInquiry({
      id: inquiry.id,
      status: 'resolved',
    })
    expect(demoStore.notifications(staff.id)).toHaveLength(2)

    expect(() =>
      demoStore.respondToInquiry({
        id: inquiry.id,
        status: 'resolved',
        response: 'A second reply should not be allowed.',
      }),
    ).toThrow('This inquiry already has an Admin response')

    demoStore.login('staff@rallypoint.local', 'staff123')
    expect(demoStore.inquiriesForUser(staff.id)[0]).toMatchObject({
      response: 'I updated your access.',
      status: 'resolved',
    })
    expect(demoStore.notifications(staff.id)[0]).toMatchObject({
      title: 'Inquiry update',
      read: false,
    })
  })
})
