import type { Application } from '../declarations'

import { users } from './users/users'
import { authManagement } from './auth-management/auth-management'
import { mailer } from './mailer/mailer'
import { userRoles } from './user-roles/user-roles'
import { roleRequests } from './role-requests/role-requests'
import { refreshTokens } from './refresh-tokens/refresh-tokens'
import { properties } from './properties/properties'
import { units } from './units/units'
import { rentalApplications } from './rental-applications/rental-applications'
import { rentalContracts } from './rental-contracts/rental-contracts'
import { maintenanceRequests } from './maintenance-requests/maintenance-requests'
import { communications } from './communications/communications'
import { notices } from './notices/notices'
import { exchangeRates } from './exchange-rates/exchange-rates'
import { payments } from './payments/payments'
import { legalDocuments } from './legal-documents/legal-documents'
import { virtualViewingRequests } from './virtual-viewing-requests/virtual-viewing-requests'
import { verificationDocuments } from './verification-documents/verification-documents'
import { sms } from './sms/sms'
import { ai } from './ai/ai'
import { deleteAccount } from './delete-account/delete-account'
import { paystackWebhook } from './paystack-webhook/paystack-webhook'
import { files } from './files/files'
import { filesUploader } from './files-uploader/files-uploader'
import { agentProfiles } from './agent-profiles/agent-profiles'
import { agentAssignments } from './agent-assignments/agent-assignments'
import { agentListingRequests } from './agent-listing-requests/agent-listing-requests'
import { agentRatings } from './agent-ratings/agent-ratings'
import { propertyManagerAssignments } from './property-manager-assignments/property-manager-assignments'
import { propertyManagerListingRequests } from './property-manager-listing-requests/property-manager-listing-requests'
import { propertyManagerProfiles } from './property-manager-profiles/property-manager-profiles'
import { pmRatings } from './pm-ratings/pm-ratings'
import { agentPayouts } from './agent-payouts/agent-payouts'
import { pmPayouts } from './pm-payouts/pm-payouts'
import { threads } from './threads/threads'
import { inquiries } from './inquiries/inquiries'
import { chatMessages } from './chat-messages/chat-messages'
import { favorites } from './favorites/favorites'
import { dashboard } from './dashboard/dashboard'
import { listingSidebar } from './listing-sidebar/listing-sidebar'
import { userNotifications } from './user-notifications/user-notifications'
import { adminBootstrap } from './admin-bootstrap/admin-bootstrap'
import { adminMigrations } from './admin-migrations/admin-migrations'
import { sitePages } from './site-pages/site-pages'
import { registerUserNotificationTriggers } from '../user-notification-triggers'

export const services = (app: Application) => {
  app.configure(mailer)
  app.configure(users)
  app.configure(authManagement)
  app.configure(userRoles)
  app.configure(roleRequests)
  app.configure(refreshTokens)
  app.configure(properties)
  app.configure(units)
  app.configure(rentalApplications)
  app.configure(rentalContracts)
  app.configure(maintenanceRequests)
  app.configure(communications)
  app.configure(notices)
  app.configure(exchangeRates)
  app.configure(payments)
  app.configure(legalDocuments)
  app.configure(virtualViewingRequests)
  app.configure(verificationDocuments)
  app.configure(sms)
  app.configure(ai)
  app.configure(deleteAccount)
  app.configure(paystackWebhook)
  app.configure(files)
  app.configure(filesUploader)
  app.configure(agentProfiles)
  app.configure(agentAssignments)
  app.configure(agentListingRequests)
  app.configure(agentRatings)
  app.configure(propertyManagerProfiles)
  app.configure(pmRatings)
  app.configure(propertyManagerAssignments)
  app.configure(propertyManagerListingRequests)
  app.configure(agentPayouts)
  app.configure(pmPayouts)
  app.configure(threads)
  app.configure(inquiries)
  app.configure(chatMessages)
  app.configure(favorites)
  app.configure(userNotifications)
  app.configure(dashboard)
  app.configure(listingSidebar)
  app.configure(adminBootstrap)
  app.configure(adminMigrations)
  app.configure(sitePages)

  registerUserNotificationTriggers(app)
}

