// Next.js router shim
export const useRouter = () => ({
  push: (path: string) => {
    window.location.href = path;
  },
  pathname: window.location.pathname,
  query: {},
});

export default { useRouter };
