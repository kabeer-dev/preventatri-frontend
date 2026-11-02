import type {SystemRoleValue} from '@/shared/constants/common';

export interface RouteConfig {
  route: string;
  allowedRoles?: SystemRoleValue[];
}

const routeConfigRegistry = new Map<string, RouteConfig>();

export function extractRoutes({
  routeObj,
}: {
  routeObj: Record<string, any>;
}): string[] {
  return extractRouteConfigs({routeObj}).map(({route}) => route);
}

export function extractRouteConfigs({
  routeObj,
}: {
  routeObj: Record<string, any>;
}): RouteConfig[] {
  const result: RouteConfig[] = [];

  function recurse({value}: {value: any}) {
    if (typeof value === 'function') {
      const accessedProps: string[] = [];

      const proxyObj = new Proxy(
        {},
        {
          get: (_target, prop) => {
            if (
              typeof prop === 'string' &&
              prop !== 'constructor' &&
              prop !== 'prototype'
            ) {
              if (!accessedProps.includes(prop)) {
                accessedProps.push(prop);
              }

              return `:param${accessedProps.length}`;
            }

            return undefined;
          },
        }
      );

      const routePattern = value(proxyObj);

      if (typeof routePattern === 'string') {
        result.push(
          routeConfigRegistry.get(routePattern) || {route: routePattern}
        );
      }
    } else if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        recurse({value: value[key]});
      }
    }
  }

  recurse({value: routeObj});

  return result;
}

export const path = ({
  root,
  path,
  allowedRoles,
}: {
  root: string;
  path: string;
  allowedRoles?: SystemRoleValue[];
}): string => {
  const route = `${root}${path}`;

  routeConfigRegistry.set(route, {route, allowedRoles});

  return route;
};
