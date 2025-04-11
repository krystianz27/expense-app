// import { Suspense } from "react";
// import { Route, RouteProps } from "react-router-dom";
// import Spinner from "@components/shared/Spinner";

// interface LazyRouteProps extends Omit<RouteProps, "element"> {
//   component: React.LazyExoticComponent<() => JSX.Element>;
//   fallback?: JSX.Element;
// }

// const LazyRoute = ({
//   component: Component,
//   fallback = <Spinner />,
//   ...rest
// }: LazyRouteProps) => {
//   const element = (
//     <Suspense fallback={fallback}>
//       <Component />
//     </Suspense>
//   );

//   return <Route {...rest} element={element} />;
// };

// export default LazyRoute;
