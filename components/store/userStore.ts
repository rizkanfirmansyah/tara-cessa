import { RoleType, UserType } from "@/types";
import { create } from "zustand";

// Define the interface of the state
interface State {
  user: UserType;
}

// Define the interface of the actions that can be performed
interface Actions {
  session: (user: UserType) => void;
  removeSession: () => void;
}

interface UserStoreType {
  users: UserType[];
  userID?: number;
  setUserID: (userID: number) => void;
  addData: (newUser: UserType) => void;
  updateData: (newUser: UserType[]) => void;
}

interface RoleStoreType {
  roles: RoleType[];
  updateData: (newRole: RoleType[]) => void;
}

// Initialize a default state
const INITIAL_STATE: State = {
  user: {
    id: 0,
    hotelId: 0,
    email: "",
    name: "",
    roleId: 0,
    role: {
      id: 0,
      name: "",
      canManageUser: 0,
      canManageData: 0,
      canManageHotels: 0,
      canManageDevices: 0,
      frontdesk: 0,
      createdAt: "",
      updatedAt: "",
      order: 0,
    },
    token: "",
    createdAt: "",
    updatedAt: "",
  },
};

// Create the store with Zustand, combining the status interface and actions
export const useSessionUser = create<State & Actions>((set, get) => ({
  user:
    typeof window !== "undefined"
      ? localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") ?? "0")
        : INITIAL_STATE.user
      : INITIAL_STATE.user,
  session: (user: UserType) => {
    set({ user });
    localStorage.setItem("user", JSON.stringify(user));
  },
  removeSession: () => {
    set({ user: INITIAL_STATE.user });
    localStorage.removeItem("user");
  },
}));

export const useRoleStore = create<RoleStoreType>((set) => ({
  roles: [],
  updateData: (newRole: RoleType[]) => {
    set({ roles: newRole });
  },
}));

export const useUserStore = create<UserStoreType>((set) => ({
  users: [],
  userID: 0,
  setUserID: (userID: number) => set({ userID: userID }),
  addData: (newUser: UserType) => {
    set((state) => ({
      users: [...state.users, newUser],
    }));
  },
  updateData: (newUser: UserType[]) => {
    set({ users: newUser });
  },
}));
