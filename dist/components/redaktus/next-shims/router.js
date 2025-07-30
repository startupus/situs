// Next.js router shim
export const useRouter = () => ({
    push: (path) => {
        window.location.href = path;
    },
    pathname: window.location.pathname,
    query: {},
});
export default { useRouter };
//# sourceMappingURL=router.js.map