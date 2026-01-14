import { routes } from "@/config/routes"
import AuthLayout from "@/layouts/AuthLayout"
import SigninPage from "@/pages/SigninPage"
import DefaultLayout from "@/layouts/DefaultLayout"
import OrganizerRequestPage from "@/pages/OrganizerRequestPage"
import OrganizerRequestDetailPage from "@/pages/OrganizerRequestDetailPage"

export const publicRoutes = [
    { path: routes.signin, page: SigninPage, layout: AuthLayout },
    { path: routes.organizerRegistration, page: OrganizerRequestPage, layout: DefaultLayout },
    { path: routes.organizerRegistrationDetail, page: OrganizerRequestDetailPage, layout: DefaultLayout },


]
export const privateRoutes = []
export const adminRoutes = []
