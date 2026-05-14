export type QueryErrorBannerProps = {
  message: string;
  onRetry: () => void;
};

export function QueryErrorBanner({ message, onRetry }: QueryErrorBannerProps) {
  return (
    <div role="alert" className="query-error-banner">
      <p className="query-error-banner__text">{message}</p>
      <button type="button" className="query-error-banner__retry" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
