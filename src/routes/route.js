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
import ResalePostManagementPage from "@/pages/ResalePostManagementPage"
import ResalePostDetailPage from "@/pages/ResalePostDetailPage"
import TagPage from "@/pages/TagPage"
import UserManagementPage from "@/pages/UserManagementPage"
import UserDetailPage from "@/pages/UserDetailPage"
import ConfirmAdminUserPage from "@/pages/ConfirmAdminUserPage"
import EditProfilePage from "@/pages/EditProfilePage"
import ChangePasswordPage from "@/pages/ChangePasswordPage"
import StatsPage from "@/pages/StatsPage"
import OverviewPage from "@/pages/OverviewPage"
import WithdrawalManagementPage from "@/pages/WithdrawalManagementPage"
import WithdrawalDetailPage from "@/pages/WithdrawalDetailPage"

export const publicRoutes = [
    { path: routes.signin, page: SigninPage, layout: AuthLayout },
    { path: routes.confirmUser, page: ConfirmAdminUserPage, layout: AuthLayout },

]

export const privateRoutes = [
    { path: routes.organizerRegistration, page: OrganizerRequestPage, layout: DefaultLayout },
    { path: routes.organizerRegistrationDetail, page: OrganizerRequestDetailPage, layout: DefaultLayout },
    { path: routes.eventManagement, page: EventManagement, layout: DefaultLayout },
    { path: routes.eventDetail, page: EventDetailPage, layout: DefaultLayout },
    { path: routes.category, page: CategoryPage, layout: DefaultLayout },
    { path: routes.setting, page: SettingsPage, layout: DefaultLayout },
    { path: routes.resalePost, page: ResalePostManagementPage, layout: DefaultLayout },
    { path: routes.resalePostDetail, page: ResalePostDetailPage, layout: DefaultLayout },
    { path: routes.tag, page: TagPage, layout: DefaultLayout },
    { path: routes.home, page: OverviewPage, layout: DefaultLayout },
    { path: routes.user, page: UserManagementPage, layout: DefaultLayout },
    { path: routes.userDetail, page: UserDetailPage, layout: DefaultLayout },
    { path: routes.profile, page: EditProfilePage, layout: DefaultLayout },
    { path: routes.changePassWord, page: ChangePasswordPage, layout: DefaultLayout },
    { path: routes.stats, page: StatsPage, layout: DefaultLayout },
    { path: routes.overview, page: OverviewPage, layout: DefaultLayout },
    { path: routes.withdrawalRequest, page: WithdrawalManagementPage, layout: DefaultLayout },
    { path: routes.withdrawalRequestDetail, page: WithdrawalDetailPage, layout: DefaultLayout },

]