import {defineStore} from "pinia";
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
    onSnapshot,
    where,
    query,
} from "firebase/firestore";

import type {User} from "firebase/auth";

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
        user: null as User | null,
        unsubscribeBeverages: null as (() => void) | null,
        usrMessage: null as string | null,
        selectedPreset: null as string | null,
    }),

    actions: {
        async init() {
            let snapshot = await getDocs(collection(db, "bases"));

            // @ts-ignore
            this.bases = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            snapshot = await getDocs(collection(db, "creamers"));

            //@ts-ignore
            this.creamers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            snapshot = await getDocs(collection(db, "syrups"));

            //@ts-ignore
            this.syrups = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            this.setDefaults();
        },
        setDefaults() {
            this.currentBase = this.bases[0];
            this.currentCreamer = this.creamers[0];
            this.currentSyrup = this.syrups[0];
            this.currentTemp = "Hot";
        },
        setUser(user: User | null) {
            this.user = user;

            if (this.unsubscribeBeverages) {
                this.unsubscribeBeverages();
                this.unsubscribeBeverages = null;
            }

            if (!user) {
                this.beverages = [];
                this.currentBeverage = null;
                return;
            }

            const q = query(
                collection(db, "beverages"),
                where("uid", "==", user.uid)
            );

            this.unsubscribeBeverages = onSnapshot(q, (snapshot) => {
                const updated: BeverageType[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as BeverageType[];

                this.beverages = updated;

                if (this.currentBeverage) {
                    const match = updated.find(
                        b => b.id === this.currentBeverage?.id
                    );

                    this.currentBeverage = match ?? null;
                }
            });
        },
        async makeBeverage(): Promise<string> {
            if (!this.user) {
                return "No user logged in, please sign in first.";
            }

            if (
                !this.currentName ||
                !this.currentBase ||
                !this.currentTemp ||
                !this.currentSyrup ||
                !this.currentCreamer
            ) {
                return "Please complete all beverage options and the name before making a beverage.";
            }

            try {
                const id = crypto.randomUUID();

                const newBeverage: BeverageType = {
                    id,
                    name: this.currentName,
                    base: this.currentBase,
                    temp: this.currentTemp,
                    syrup: this.currentSyrup,
                    creamer: this.currentCreamer,
                    uid: this.user.uid,
                };

                this.beverages.push(newBeverage);
                this.currentBeverage = newBeverage;

                await setDoc(doc(db, "beverages", id), newBeverage);

                return `Beverage ${this.currentName} made successfully!`;
            } catch (err) {
                return "Something went wrong while creating the beverage.";
            }
        },

        showBeverage(id: string) {
            const bev = this.beverages.find(b => b.id === id);
            if (!bev) return;

            this.currentBase = bev.base;
            this.currentSyrup = bev.syrup;
            this.currentTemp = bev.temp;
            this.currentCreamer = bev.creamer;
        },
    },
});
