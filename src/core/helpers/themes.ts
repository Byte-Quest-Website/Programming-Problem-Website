import { Extension } from "@uiw/react-codemirror";
import { Settings } from "@uiw/codemirror-themes";
import * as allThemes from "@uiw/codemirror-themes-all";

const THEMES: {
    [key: string]: [Extension, Settings];
} = {
    dark: [allThemes.basicDark, allThemes.defaultSettingsBasicDark],
    light: [allThemes.basicLight, allThemes.defaultSettingsBasicLight],
    abcdef: [allThemes.abcdef, allThemes.defaultSettingsAbcdef],
    abyss: [allThemes.abyss, allThemes.defaultSettingsAbyss],
    androidstudio: [
        allThemes.androidstudio,
        allThemes.defaultSettingsAndroidstudio,
    ],
    atomone: [allThemes.atomone, allThemes.defaultSettingsAtomone],
    aura: [allThemes.aura, allThemes.defaultSettingsAura],
    bbedit: [allThemes.bbedit, allThemes.defaultSettingsBbedit],
    bespin: [allThemes.bespin, allThemes.defaultSettingsBespin],
    dracula: [allThemes.dracula, allThemes.defaultSettingsDracula],
    duotoneDark: [allThemes.duotoneDark, allThemes.defaultSettingsDuotoneDark],
    duotoneLight: [
        allThemes.duotoneLight,
        allThemes.defaultSettingsDuotoneLight,
    ],
    eclipse: [allThemes.eclipse, allThemes.defaultSettingsEclipse],
    githubDark: [allThemes.githubDark, allThemes.defaultSettingsGithubDark],
    githubLight: [allThemes.githubLight, allThemes.defaultSettingsGithubLight],
    gruvboxDark: [allThemes.gruvboxDark, allThemes.defaultSettingsGruvboxDark],
    gruvboxLight: [
        allThemes.gruvboxLight,
        allThemes.defaultSettingsGruvboxLight,
    ],
    kimbie: [allThemes.kimbie, allThemes.defaultSettingsKimbie],
    material: [allThemes.material, allThemes.defaultSettingsMaterial],
    materialDark: [
        allThemes.materialDark,
        allThemes.defaultSettingsMaterialDark,
    ],
    materialLight: [
        allThemes.materialLight,
        allThemes.defaultSettingsMaterialLight,
    ],
    monokai: [allThemes.monokai, allThemes.defaultSettingsMonokai],
    monokaiDimmed: [
        allThemes.monokaiDimmed,
        allThemes.defaultSettingsMonokaiDimmed,
    ],
    noctisLilac: [allThemes.noctisLilac, allThemes.defaultSettingsNoctisLilac],
    nord: [allThemes.nord, allThemes.defaultSettingsNord],
    okaidia: [allThemes.okaidia, allThemes.defaultSettingsOkaidia],
    quietlight: [allThemes.quietlight, allThemes.defaultSettingsQuietlight],
    red: [allThemes.red, allThemes.defaultSettingsRed],
    solarizedDark: [
        allThemes.solarizedDark,
        allThemes.defaultSettingsSolarizedDark,
    ],
    solarizedLight: [
        allThemes.solarizedLight,
        allThemes.defaultSettingsSolarizedLight,
    ],
    sublime: [allThemes.sublime, allThemes.defaultSettingsSublime],
    tokyoNight: [allThemes.tokyoNight, allThemes.defaultSettingsTokyoNight],
    tokyoNightDay: [
        allThemes.tokyoNightDay,
        allThemes.defaultSettingsTokyoNightDay,
    ],
    tokyoNightStorm: [
        allThemes.tokyoNightStorm,
        allThemes.defaultSettingsTokyoNightStorm,
    ],
    tomorrowNightBlue: [
        allThemes.tomorrowNightBlue,
        allThemes.defaultSettingsTomorrowNightBlue,
    ],
    vscodeDark: [allThemes.vscodeDark, allThemes.defaultSettingsVscodeDark],
    xcodeDark: [allThemes.xcodeDark, allThemes.defaultSettingsXcodeDark],
    xcodeLight: [allThemes.xcodeLight, allThemes.defaultSettingsXcodeLight],
};

export default THEMES;
