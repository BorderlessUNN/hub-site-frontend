import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type MemberProfile = {
  phone: string;
  name: string;
  email: string;
  department: string;
  whatsapp_number: string;
  date_of_birth: string;
  tech_stack: string;
  membership_type: string;
  subscription_status: string;
  total_amount: number;
  amount_paid: number;
  installment_stage: string;
  start_date: string;
  expiry_date: string;
  partial_expiry_date: string;
};

const profileKey = (phone: string) => `member_profile_${phone}`;

const defaultProfile = (phone: string): MemberProfile => ({
  phone,
  name: "",
  email: "",
  department: "",
  whatsapp_number: "",
  date_of_birth: "",
  tech_stack: "",
  membership_type: "Subsidized Monthly",
  subscription_status: "inactive",
  total_amount: 5000,
  amount_paid: 0,
  installment_stage: "none",
  start_date: "",
  expiry_date: "",
  partial_expiry_date: "",
});

const loadProfile = (phone: string): MemberProfile | null => {
  const raw = localStorage.getItem(profileKey(phone));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MemberProfile;
  } catch {
    return null;
  }
};

const saveProfile = (profile: MemberProfile) => {
  localStorage.setItem(profileKey(profile.phone), JSON.stringify(profile));
};

export default function Member({
  email,
  email_handler,
  forceEditMode = false,
}: {
  email: string;
  email_handler: (email: string) => void;
  forceEditMode?: boolean;
}) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [currentPhone, setCurrentPhone] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedPhone = localStorage.getItem("member_session_phone");
    if (!savedPhone) {
      setLoaded(true);
      return;
    }

    setCurrentPhone(savedPhone);
    const storedProfile = loadProfile(savedPhone);

    if (storedProfile) {
      setProfile(storedProfile);
      setEditMode(forceEditMode);
    } else {
      setProfile(defaultProfile(savedPhone));
      setEditMode(true);
    }

    setLoaded(true);
  }, [forceEditMode]);

  const handleFieldChange = (field: keyof MemberProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSaveProfile = () => {
    if (!profile) return;
    if (
      !profile.name ||
      !profile.email ||
      !profile.department ||
      !profile.whatsapp_number ||
      !profile.date_of_birth ||
      !profile.tech_stack
    ) {
      setMessage("Please complete all profile fields before saving.");
      return;
    }

    saveProfile(profile);
    setEditMode(false);
    setMessage("Profile saved successfully.");
    navigate("/dashboard/profile", { replace: true });
  };

  const paymentProgress = profile
    ? Math.min(100, Math.round((profile.amount_paid / profile.total_amount) * 100))
    : 0;

  const dueText = profile
    ? profile.subscription_status === "active"
      ? "Subscription is active."
      : profile.subscription_status === "partial_active"
      ? "Partial access is active. Complete the second payment within 7 days."
      : profile.subscription_status === "expired_partial"
      ? "Partial subscription expired. Restart the subscription process."
      : profile.subscription_status === "inactive"
      ? "No active subscription yet."
      : "Subscription is not active."
    : "";

  const subscriptionStatusColor = profile?.subscription_status === "active"
    ? "text-[#0F172A]"
    : "text-red-600";

  const subscriptionProgressColor = profile?.subscription_status === "active"
    ? "#FFDD00"
    : "#EF4444";

  if (!loaded) return null;

  if (!currentPhone) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl rounded-[28px] border border-[#FFDD00] bg-white p-8 shadow-lg text-center">
          <h1 className="text-2xl font-bold text-[#04252D]">Member access</h1>
          <p className="mt-4 text-sm text-[#64748B]">
            Please sign in as a member first so we can load your profile and subscription details.
          </p>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/login")}
            className="mt-8 rounded-lg bg-[#FFDD00] px-6 py-3 text-sm font-semibold text-[#04252D]"
          >
            Go to member login
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2] px-6 py-20 lg:px-10">
      <div className="mx-auto w-full max-w-6xl rounded-[28px] border border-[#E5E7EB] bg-white p-8 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#94A3B8]">Member profile</p>
            <h1 className="mt-3 text-3xl font-bold text-[#0F172A]">{editMode ? "Complete your profile" : "Your member dashboard"}</h1>
            <p className="mt-2 text-sm text-[#64748B] max-w-2xl">
              {editMode
                ? "Finish your profile to access your subscription and membership details."
                : "Review your member profile, subscription status, and manage your account from one place."}
            </p>
          </div>

          {!editMode && (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/dashboard/profile/update")}
              className="w-full max-w-[220px] rounded-2xl bg-[#FFDD00] px-6 py-3 text-sm font-semibold text-[#04252D]"
            >
              Update profile
            </motion.button>
          )}
        </div>

        {message ? (
          <div className="mb-6 rounded-2xl border border-[#D1D5DB] bg-[#ECFDF5] px-4 py-3 text-sm text-[#166534]">
            {message}
          </div>
        ) : null}

        {editMode && profile ? (
          <div className="space-y-6 rounded-[28px] border border-[#E5E7EB] bg-[#F8FAFC] p-6 shadow-sm">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold">Complete your member profile</h2>
                <p className="mt-2 text-sm text-[#475569]">
                  These details are required to display your account and subscription information.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: "Full Name", field: "name" },
                  { label: "Email", field: "email" },
                  { label: "Department", field: "department" },
                  { label: "WhatsApp Number", field: "whatsapp_number" },
                  { label: "Date of Birth", field: "date_of_birth", type: "date" },
                  { label: "Tech Stack", field: "tech_stack" },
                ].map((input) => (
                  <label key={input.field} className="block text-sm font-semibold text-[#334155]">
                    {input.label}
                    <input
                      type={input.type ?? "text"}
                      value={profile[input.field as keyof MemberProfile] as string}
                      onChange={(event) =>
                        handleFieldChange(input.field as keyof MemberProfile, event.target.value)
                      }
                      className="mt-2 w-full rounded-2xl border border-[#CBD5E1] bg-white px-4 py-3 text-base outline-none transition focus:border-[#FFDD00]"
                    />
                  </label>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[#CBD5E1] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#64748B]">Phone</p>
                  <p className="mt-2 font-semibold text-[#0F172A]">{profile.phone}</p>
                </div>
                <div className="rounded-2xl border border-[#CBD5E1] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#64748B]">Membership</p>
                  <p className="mt-2 font-semibold text-[#0F172A]">{profile.membership_type}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveProfile}
                className="w-full rounded-lg bg-[#FFDD00] px-5 py-3 text-sm font-semibold text-[#04252D]"
              >
                Save profile
              </motion.button>
            </div>
          </div>
        ) : profile ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] border border-[#E5E7EB] bg-[#FFFFFF] p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#94A3B8]">Profile</p>
                  <h2 className="mt-2 text-xl font-semibold text-[#0F172A]">Welcome, {profile.name || "Member"}</h2>
                </div>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditMode(true)}
                  className="rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-2 text-sm font-semibold text-[#0F172A]"
                >
                  Edit profile
                </motion.button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#64748B]">Full Name</p>
                  <p className="mt-2 font-semibold text-[#0F172A]">{profile.name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#64748B]">Email</p>
                  <p className="mt-2 font-semibold text-[#0F172A]">{profile.email || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#64748B]">Phone</p>
                  <p className="mt-2 font-semibold text-[#0F172A]">{profile.phone}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#64748B]">Department</p>
                  <p className="mt-2 font-semibold text-[#0F172A]">{profile.department || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#64748B]">WhatsApp</p>
                  <p className="mt-2 font-semibold text-[#0F172A]">{profile.whatsapp_number || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#64748B]">Tech Stack</p>
                  <p className="mt-2 font-semibold text-[#0F172A]">{profile.tech_stack || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#64748B]">Date of birth</p>
                  <p className="mt-2 font-semibold text-[#0F172A]">{profile.date_of_birth || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#64748B]">Membership type</p>
                  <p className="mt-2 font-semibold text-[#0F172A]">{profile.membership_type}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#E5E7EB] bg-[#F8FAFC] p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-[#64748B]">Subscription overview</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm text-[#475569]">Status</p>
                  <p className={`mt-1 font-semibold ${subscriptionStatusColor}`}>{profile.subscription_status}</p>
                </div>
                <div>
                  <p className="text-sm text-[#475569]">Payment progress</p>
                  <p className="mt-1 font-semibold text-[#0F172A]">{paymentProgress}%</p>
                </div>
                <div>
                  <p className="text-sm text-[#475569]">Amount paid</p>
                  <p className="mt-1 font-semibold text-[#0F172A]">₦{profile.amount_paid} / ₦{profile.total_amount}</p>
                </div>
                <div>
                  <p className="text-sm text-[#475569]">Expiry</p>
                  <p className="mt-1 font-semibold text-[#0F172A]">
                    {profile.expiry_date || "No active subscription"}
                  </p>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#E2E8F0]">
                  <div
                    style={{
                      width: `${paymentProgress}%`,
                      backgroundColor: subscriptionProgressColor,
                    }}
                    className="h-full rounded-full"
                  />
                </div>
                <p className="text-xs text-[#64748B]">{dueText}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
