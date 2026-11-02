import {useCallback, useState} from 'react';

// Which notification clusters are expanded, shared by the notifications page
// and the bell dropdown so both toggle groups the same way.
export default function useExpandedClusters() {
  const [expandedClusters, setExpandedClusters] = useState<Set<string>>(
    new Set()
  );

  const isClusterExpanded = useCallback(
    (key: string) => expandedClusters.has(key),
    [expandedClusters]
  );

  const toggleCluster = useCallback((key: string) => {
    setExpandedClusters((prev) => {
      const next = new Set(prev);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  }, []);

  return {isClusterExpanded, toggleCluster};
}
