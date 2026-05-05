import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import CheckIns from "./pages/dashboard/CheckInsPage";

const DashboardDefault = () => {
  const memberPhone = localStorage.getItem("member_session_phone");
  return memberPhone ? (
    <Navigate to="profile" replace />
  ) : (
    <Navigate to="check-ins" replace />
  );
};
import Schedule from "./pages/dashboard/SchedulePage";
import Register from "./pages/dashboard/RegisterPage";
import Statistics from "./pages/dashboard/StatisticsPage";
import { useAuth } from "./context/authContext";
import AdminLogin from "./pages/AdminLogin";
import NonMemberLogin from "./pages/NonMemberLogin";
import LandingPage from "./pages/LandingPage";
import MemberLogin from "./pages/MemberLogin";
import BookTime from "./pages/BookTime";

import Member from "./pages/Member";
import NonMember from "./pages/NonMember";
import Seats from "./pages/seats";
import PaymentMade from "./pages/paymentMade";
import SaveDetails from "./pages/detailsSaved";
import GuestDetails from "./pages/guestDetails";
import DashboardLayout from "./componeents/dashboard/dashBoardLayout";

export type availablePlan = {
  expires_at: Date;
  seat_id: string;
};
export default function App() {
  const { isLoggedIn } = useAuth();
  const [email, set_email] = useState("");
  const [available_plan, set_available_plan] = useState<availablePlan[] | []>(
    []
  );

  const time_expired = (time: Date) => {
    return time.getTime() < Date.now();
  };

  const available_plan_handler = (plan: availablePlan[]) => {
    set_available_plan(plan);
  };

  const email_handler = (email: string) => {
    set_email(email);
  };

  return (
    <Router>
      <Routes>
        {/* Public routes (always available) */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <MemberLogin />
          }
        />
        <Route
          path="/book-time"
          element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <BookTime />
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/nonMemberLogin"
          element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <NonMemberLogin />
          }
        />
          <Route
            path="/dashboard"
            element={
              <DashboardLayout
                time_expired={time_expired}
                checked_in_email={email}
                available_plan={available_plan}
              />
            }
          >
            {/* Default page under /dashboard */}
            <Route index element={<DashboardDefault />} />

            <Route
              path="check-ins"
              element={<CheckIns email={email} email_handler={email_handler} />}
            />
            <Route path="statistics" element={<Statistics />} />
            <Route path="register" element={<Register />} />
            <Route path="schedule" element={<Schedule />} />

            <Route
              path="nonMember"
              element={
                <NonMember
                  email={email}
                  email_handler={email_handler}
                  available_plan_handler={available_plan_handler}
                />
              }
            />
            <Route
              path="profile"
              element={<Member email={email} email_handler={email_handler} />}
            />
            <Route
              path="profile/update"
              element={
                <Member
                  email={email}
                  email_handler={email_handler}
                  forceEditMode
                />
              }
            />
            <Route path="isMember" element={<Navigate to="profile" replace />} />
            <Route path="seats" element={<Seats />} />
            <Route
              path="enterDetails"
              element={<GuestDetails checked_in_email={email} />}
            />
            <Route
              path="paymentMade"
              element={
                <PaymentMade email={email} email_handler={email_handler} />
              }
            />
            <Route
              path="detailSaved"
              element={<SaveDetails checked_in_email={email} />}
            />
            <Route path="*" element={<Navigate to="check-ins" replace />} />
          </Route>
        {/* Fallback: if no route matches */}
        <Route
          path="*"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}
