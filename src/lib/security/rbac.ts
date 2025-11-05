export type Role = 'learner' | 'instructor' | 'admin'

export type Permission =
  | 'modules.read'
  | 'modules.write'
  | 'assessments.read'
  | 'assessments.write'
  | 'analytics.read'
  | 'content.approve'
  | 'admin.manage'

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  learner: ['modules.read', 'assessments.read'],
  instructor: ['modules.read', 'assessments.read', 'assessments.write', 'analytics.read', 'content.approve'],
  admin: ['modules.read', 'modules.write', 'assessments.read', 'assessments.write', 'analytics.read', 'content.approve', 'admin.manage']
}

export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}
