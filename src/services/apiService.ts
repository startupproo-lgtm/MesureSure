import {
  UserEntity,
  InstrumentEntity,
  CertificateEntity,
  PaymentReceiptEntity,
  PaymentSessionEntity,
  GrievanceReportEntity,
  TechnicalIssueReportEntity,
  AuditLogEntity,
  UserRole,
  PaymentMode
} from '../types';

const TOKEN_STORAGE_KEY = 'nlm_auth_token';

export function getStoredAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredAuthToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {}
}

export function clearStoredAuthToken(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {}
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP error ${response.status}: ${response.statusText}`);
  }

  return data;
}

// --------------------------------------------------------------------------
// AUTHENTICATION APIS
// --------------------------------------------------------------------------

export async function loginUserApi(
  email: string,
  password: string,
  role?: UserRole,
  customName?: string,
  customDept?: string
): Promise<{ user: UserEntity; token: string }> {
  const res = await request<{ success: boolean; user: UserEntity; token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role, customName, customDept })
  });
  if (res.token) {
    setStoredAuthToken(res.token);
  }
  return res;
}

export async function registerUserApi(payload: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  businessOrDepartment?: string;
  phone?: string;
  licenseNumber?: string;
}): Promise<{ user: UserEntity; token: string }> {
  const res = await request<{ success: boolean; user: UserEntity; token: string }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  if (res.token) {
    setStoredAuthToken(res.token);
  }
  return res;
}

export async function getCurrentUserApi(): Promise<UserEntity | null> {
  const token = getStoredAuthToken();
  if (!token) return null;
  try {
    const res = await request<{ success: boolean; user: UserEntity }>('/api/auth/me');
    return res.user;
  } catch {
    clearStoredAuthToken();
    return null;
  }
}

export async function logoutUserApi(): Promise<void> {
  try {
    await request('/api/auth/logout', { method: 'POST' });
  } catch {}
  clearStoredAuthToken();
}

export async function fetchUsersApi(): Promise<UserEntity[]> {
  const res = await request<{ success: boolean; users: UserEntity[] }>('/api/auth/users');
  return res.users || [];
}

// --------------------------------------------------------------------------
// MULTI-DEVICE MOBILE PAYMENT SESSION APIS
// --------------------------------------------------------------------------

export async function createPaymentSessionApi(instrumentId: string): Promise<PaymentSessionEntity> {
  const res = await request<{ success: boolean; session: PaymentSessionEntity }>('/api/payments/create-session', {
    method: 'POST',
    body: JSON.stringify({ instrumentId })
  });
  return res.session;
}

export async function getPaymentSessionApi(sessionId: string): Promise<PaymentSessionEntity> {
  const res = await request<{ success: boolean; session: PaymentSessionEntity }>(`/api/payments/session/${sessionId}`);
  return res.session;
}

export async function markPaymentSessionScannedApi(sessionId: string): Promise<PaymentSessionEntity> {
  const res = await request<{ success: boolean; session: PaymentSessionEntity }>(`/api/payments/session/${sessionId}/scan`, {
    method: 'POST'
  });
  return res.session;
}

export async function payPaymentSessionOnPhoneApi(
  sessionId: string,
  details: {
    paymentMode: PaymentMode;
    paymentModeLabel: string;
    paymentMethodDetails?: string;
  }
): Promise<{ session: PaymentSessionEntity; receipt: PaymentReceiptEntity }> {
  const res = await request<{ success: boolean; session: PaymentSessionEntity; receipt: PaymentReceiptEntity }>(
    `/api/payments/session/${sessionId}/pay`,
    {
      method: 'POST',
      body: JSON.stringify(details)
    }
  );
  return res;
}

export async function pollPaymentSessionStatusApi(sessionId: string): Promise<{
  sessionId: string;
  status: 'PENDING' | 'SCANNED' | 'PROCESSING' | 'COMPLETED' | 'EXPIRED';
  paidAt?: number;
  receipt?: PaymentReceiptEntity;
}> {
  return request(`/api/payments/session/${sessionId}/status`);
}

// --------------------------------------------------------------------------
// DATABASE CRUD APIS
// --------------------------------------------------------------------------

export async function fetchInstrumentsApi(): Promise<InstrumentEntity[]> {
  const res = await request<{ success: boolean; instruments: InstrumentEntity[] }>('/api/instruments');
  return res.instruments || [];
}

export async function saveInstrumentApi(instrument: InstrumentEntity): Promise<InstrumentEntity> {
  const res = await request<{ success: boolean; instrument: InstrumentEntity }>('/api/instruments', {
    method: 'POST',
    body: JSON.stringify(instrument)
  });
  return res.instrument;
}

export async function fetchCertificatesApi(): Promise<CertificateEntity[]> {
  const res = await request<{ success: boolean; certificates: CertificateEntity[] }>('/api/certificates');
  return res.certificates || [];
}

export async function saveCertificateApi(cert: CertificateEntity): Promise<CertificateEntity> {
  const res = await request<{ success: boolean; certificate: CertificateEntity }>('/api/certificates', {
    method: 'POST',
    body: JSON.stringify(cert)
  });
  return res.certificate;
}

export async function fetchGrievancesApi(): Promise<GrievanceReportEntity[]> {
  const res = await request<{ success: boolean; grievances: GrievanceReportEntity[] }>('/api/grievances');
  return res.grievances || [];
}

export async function saveGrievanceApi(grievance: GrievanceReportEntity): Promise<GrievanceReportEntity> {
  const res = await request<{ success: boolean; grievance: GrievanceReportEntity }>('/api/grievances', {
    method: 'POST',
    body: JSON.stringify(grievance)
  });
  return res.grievance;
}

export async function fetchTechnicalIssuesApi(): Promise<TechnicalIssueReportEntity[]> {
  const res = await request<{ success: boolean; issues: TechnicalIssueReportEntity[] }>('/api/issues');
  return res.issues || [];
}

export async function saveTechnicalIssueApi(issue: TechnicalIssueReportEntity): Promise<TechnicalIssueReportEntity> {
  const res = await request<{ success: boolean; issue: TechnicalIssueReportEntity }>('/api/issues', {
    method: 'POST',
    body: JSON.stringify(issue)
  });
  return res.issue;
}

export async function fetchAuditLogsApi(): Promise<AuditLogEntity[]> {
  const res = await request<{ success: boolean; logs: AuditLogEntity[] }>('/api/audit-logs');
  return res.logs || [];
}
