import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useListWorkspaces, getListWorkspacesQueryKey } from "@workspace/api-client-react";
import { useUser } from "@clerk/react";

interface WorkspaceCtx {
  currentWorkspaceId: number | null;
  setCurrentWorkspaceId: (id: number) => void;
  workspaces: any[];
  isLoading: boolean;
  hasNoWorkspace: boolean;
}

const WorkspaceContext = createContext<WorkspaceCtx>({
  currentWorkspaceId: null,
  setCurrentWorkspaceId: () => {},
  workspaces: [],
  isLoading: true,
  hasNoWorkspace: false,
});

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useUser();
  const { data: workspaces = [], isLoading } = useListWorkspaces({
    query: { enabled: !!isSignedIn, queryKey: getListWorkspacesQueryKey() },
  });

  const [currentWorkspaceId, setCurrentWorkspaceIdState] = useState<number | null>(() => {
    const stored = localStorage.getItem("currentWorkspaceId");
    return stored ? Number(stored) : null;
  });

  useEffect(() => {
    if (!isLoading && workspaces.length > 0) {
      const valid = workspaces.find((w: any) => w.id === currentWorkspaceId);
      if (!valid) {
        const id = workspaces[0].id;
        setCurrentWorkspaceIdState(id);
        localStorage.setItem("currentWorkspaceId", String(id));
      }
    }
  }, [isLoading, workspaces, currentWorkspaceId]);

  const setCurrentWorkspaceId = (id: number) => {
    setCurrentWorkspaceIdState(id);
    localStorage.setItem("currentWorkspaceId", String(id));
  };

  const hasNoWorkspace = !isLoading && !!isSignedIn && workspaces.length === 0;

  return (
    <WorkspaceContext.Provider value={{ currentWorkspaceId, setCurrentWorkspaceId, workspaces, isLoading, hasNoWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}
