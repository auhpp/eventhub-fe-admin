import { routes } from "@/config/routes"
import AuthLayout from "@/layouts/AuthLayout"
import SigninPage from "@/pages/SigninPage"
import DefaultLayout from "@/layouts/DefaultLayout"
import OrganizerRequestPage from "@/pages/OrganizerRequestPage"
import OrganizerRequestDetailPage from "@/pages/OrganizerRequestDetailPage"
import EventManagement from "@/pages/EventManagementPage"
import EventDetailPage from "@/pages/EventDetailPage"
import CategoryPage from "@/pages/CategoryPage"
import SettingsPage from "@/pages/SettingsPage"

export const publicRoutes = [
    { path: routes.signin, page: SigninPage, layout: AuthLayout },
]

export const privateRoutes = [
    { path: routes.organizerRegistration, page: OrganizerRequestPage, layout: DefaultLayout },
    { path: routes.organizerRegistrationDetail, page: OrganizerRequestDetailPage, layout: DefaultLayout },
    { path: routes.eventManagement, page: EventManagement, layout: DefaultLayout },
    { path: routes.eventDetail, page: EventDetailPage, layout: DefaultLayout },
    { path: routes.category, page: CategoryPage, layout: DefaultLayout },
    { path: routes.setting, page: SettingsPage, layout: DefaultLayout },

]