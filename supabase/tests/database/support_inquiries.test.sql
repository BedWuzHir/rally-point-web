begin;

set local role postgres;

create extension if not exists pgtap with schema extensions;

set local search_path = public, extensions, pg_catalog;

select extensions.plan(15);

insert into auth.users (id, email, raw_user_meta_data)
values
  ('11111111-1111-4111-8111-111111111111', 'inquiry-staff@example.com', '{"full_name":"Inquiry Staff"}'::jsonb),
  ('22222222-2222-4222-8222-222222222222', 'other-staff@example.com', '{"full_name":"Other Staff"}'::jsonb),
  ('33333333-3333-4333-8333-333333333333', 'inquiry-admin@example.com', '{"full_name":"Inquiry Admin"}'::jsonb);

update public.profiles set role = 'staff' where id in (
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222'
);
update public.profiles set role = 'admin' where id = '33333333-3333-4333-8333-333333333333';

set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';

select extensions.lives_ok(
  $$insert into public.support_inquiries (id, user_id, category, subject, message)
    values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', auth.uid(), 'booking', 'Schedule access', 'Please help with the schedule.')$$,
  'staff can submit an inquiry for their own account'
);

select extensions.throws_ok(
  $$insert into public.support_inquiries (user_id, category, subject, message)
    values ('22222222-2222-4222-8222-222222222222', 'other', 'Impersonated', 'Not my inquiry.')$$,
  '42501',
  null,
  'staff cannot submit an inquiry for another account'
);

set local role postgres;
insert into public.support_inquiries (id, user_id, category, subject, message)
values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '22222222-2222-4222-8222-222222222222', 'other', 'Other staff concern', 'A separate private inquiry.');

set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';

select extensions.is(
  (select count(*)::integer from public.support_inquiries),
  1,
  'staff can only read their own inquiry'
);

select extensions.throws_ok(
  $$update public.support_inquiries set status = 'resolved' where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'$$,
  '42501',
  null,
  'staff cannot update inquiry rows directly'
);

select extensions.is(
  (select status from public.support_inquiries where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  'open',
  'staff cannot change inquiry status'
);

select extensions.throws_ok(
  $$select * from public.admin_update_support_inquiry('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'in_progress', 'Not an admin reply')$$,
  '42501',
  'Only admins can update inquiries',
  'staff cannot call the Admin inquiry update operation'
);

set local role authenticated;
set local request.jwt.claim.sub = '33333333-3333-4333-8333-333333333333';

select extensions.is(
  (select count(*)::integer from public.support_inquiries),
  2,
  'Admin can read all staff inquiries'
);

select extensions.throws_ok(
  $$update public.support_inquiries set status = 'resolved' where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'$$,
  '42501',
  null,
  'Admin must use the notification-safe update operation'
);

select extensions.lives_ok(
  $$select * from public.admin_update_support_inquiry('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'in_progress', 'I updated your access.')$$,
  'Admin can update status and send one reply'
);

select extensions.is(
  (select status || '|' || response from public.support_inquiries where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  'in_progress|I updated your access.',
  'Admin response and status are saved together'
);

select extensions.is(
  (select count(*)::integer from public.notifications where user_id = '11111111-1111-4111-8111-111111111111' and title = 'Inquiry update'),
  1,
  'Admin update creates a staff notification'
);

select extensions.lives_ok(
  $$select * from public.admin_update_support_inquiry('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'resolved', null)$$,
  'Admin can later change status without sending another reply'
);

select extensions.is(
  (select count(*)::integer from public.notifications where user_id = '11111111-1111-4111-8111-111111111111' and title = 'Inquiry update'),
  2,
  'a later status change also creates a staff notification'
);

select extensions.throws_ok(
  $$select * from public.admin_update_support_inquiry('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'resolved', 'A second reply')$$,
  'P0001',
  'This inquiry already has an Admin response',
  'Admin cannot send a second reply'
);

set local request.jwt.claim.sub = '22222222-2222-4222-8222-222222222222';

select extensions.is(
  (select count(*)::integer from public.support_inquiries where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  0,
  'another staff account cannot read a coworker inquiry'
);

select * from extensions.finish();
rollback;
