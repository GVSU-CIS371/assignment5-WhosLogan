import { defineStore } from "pinia";
import {
  BaseBeverageType,
  CreamerType,
  SyrupType,
  BeverageType,
} from "../types/beverage";
import tempretures from "../data/tempretures.json";

import db from "../firebase.ts";

import {
  collection,
  getDocs,
  setDoc,
  doc,
  QuerySnapshot,
  QueryDocumentSnapshot,
  onSnapshot,
} from "firebase/firestore";

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: tempretures,
    currentTemp: tempretures[0],
    bases: [] as BaseBeverageType[],
    currentBase: null as BaseBeverageType | null,
    syrups: [] as SyrupType[],
    currentSyrup: null as SyrupType | null,
    creamers: [] as CreamerType[],
    currentCreamer: null as CreamerType | null,
    beverages: [] as BeverageType[],
    currentBeverage: null as BeverageType | null,
    currentName: "",
  }),

  actions: {
    async init() {
        let snapshot = await getDocs(collection(db, "bases"));

        // @ts-ignore
        this.bases = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        this.currentBase = this.bases[0];

        snapshot = await getDocs(collection(db, "creamers"));

        //@ts-ignore
        this.creamers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        this.currentCreamer = this.creamers[0];

        snapshot = await getDocs(collection(db, "syrups"));

        //@ts-ignore
        this.syrups = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        this.currentSyrup = this.syrups[0];
    },
    makeBeverage() {},

    showBeverage() {},
  },
});
