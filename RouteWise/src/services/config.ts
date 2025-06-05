interface AppConfig {
  API_URL: string;
  USE_MOCK_DATA: boolean;
  API_TIMEOUT: number;
  IS_DEVELOPMENT: boolean;
}

const config: AppConfig = {
  API_URL:
    (window as any).REACT_APP_API_URL ||
    process?.env?.REACT_APP_API_URL ||
    "http://localhost:5000",
  USE_MOCK_DATA:
    (window as any).REACT_APP_USE_MOCK_DATA === "true" ||
    process?.env?.REACT_APP_USE_MOCK_DATA === "true",
  API_TIMEOUT: parseInt(
    (window as any).REACT_APP_API_TIMEOUT ||
      process?.env?.REACT_APP_API_TIMEOUT ||
      "30000"
  ),
  IS_DEVELOPMENT:
    (window as any).NODE_ENV === "development" ||
    process?.env?.NODE_ENV === "development",
};

export default config;