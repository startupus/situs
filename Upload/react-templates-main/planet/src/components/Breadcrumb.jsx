import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Breadcrumb = ({ pageName }) => {
  return (
    <>
      <section className="bg-tg-bg pt-10 dark:bg-dark">
        <div className="container mx-auto">
          <div className="rounded-lg border border-light bg-white px-4 py-4 shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:shadow-card sm:px-6 md:px-8 md:py-5">
            <ul className="flex items-center">
              <li className="flex items-center">
                <Link
                  to="/"
                  className="text-base font-medium text-dark hover:text-primary dark:text-white dark:hover:text-primary"
                >
                  Home
                </Link>
                <span className="px-3 text-body-color dark:text-dark-6">
                  <svg
                    width="7"
                    height="12"
                    viewBox="0 0 7 12"
                    className="fill-current"
                  >
                    <path d="M0.879233 11.4351C0.808625 11.4351 0.720364 11.3998 0.667408 11.3469C0.543844 11.2233 0.543844 11.0291 0.649756 10.9056L5.09807 6.17483C5.18633 6.08657 5.18633 5.92771 5.09807 5.82179L0.649756 1.09105C0.526192 0.967487 0.543844 0.773315 0.667408 0.649751C0.790972 0.526187 0.985145 0.543839 1.10871 0.667403L5.55702 5.39815C5.85711 5.73353 5.85711 6.26309 5.55702 6.58083L1.10871 11.3292C1.0381 11.3998 0.967493 11.4351 0.879233 11.4351Z" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.229332 10.5281L4.48868 5.99831L0.24288 1.48294C-0.133119 1.09849 -0.0312785 0.549591 0.267983 0.25033C0.652758 -0.134445 1.2069 -0.0332381 1.50812 0.267982L1.52041 0.280272L5.9781 5.02138C6.46442 5.56491 6.47872 6.42661 5.96853 6.96778V6.96778L1.50834 11.7289C1.36051 11.8767 1.15353 12 0.879227 12C0.660517 12 0.428074 11.9064 0.267983 11.7463C-0.0719543 11.4064 -0.0699959 10.8773 0.220873 10.538L0.229332 10.5281ZM5.55702 6.58083C5.85711 6.26309 5.85711 5.73353 5.55702 5.39815L1.10871 0.667403C0.985145 0.543839 0.790972 0.526187 0.667408 0.649751C0.543844 0.773315 0.526192 0.967487 0.649756 1.09105L5.09807 5.82179C5.18633 5.92771 5.18633 6.08657 5.09807 6.17483L0.649756 10.9056C0.543844 11.0291 0.543844 11.2233 0.667408 11.3469C0.720364 11.3998 0.808625 11.4351 0.879233 11.4351C0.967493 11.4351 1.0381 11.3998 1.10871 11.3292L5.55702 6.58083Z"
                    />
                  </svg>
                </span>
              </li>

              <li className="text-base font-medium text-primary">{pageName}</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

Breadcrumb.propTypes = {
  pageName: PropTypes.string.isRequired,
};

export default Breadcrumb;
