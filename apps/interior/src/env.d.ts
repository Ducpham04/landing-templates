/// <reference types="vite/client" />
interface ImportMetaEnv {
  /** Endpoint nhận lead, vd LeadHub: https://api.domain.vn/api/public/leads?siteKey=site_xxx */
  readonly VITE_LEAD_ENDPOINT?: string;
}
