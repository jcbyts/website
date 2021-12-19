import { c as create_ssr_component, g as add_attribute, f as each, e as escape, o as onDestroy, v as validate_component } from "./app-1a513ba3.js";
import * as d3 from "d3";
import "@sveltejs/kit/ssr";
var Icon_svelte_svelte_type_style_lang = "";
const css$a = {
  code: ".c.svelte-htwn2n{fill:currentColor;height:1em;overflow:visible;width:1em}",
  map: null
};
const Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let paths;
  let rotation;
  let { name = "money" } = $$props;
  let { direction = "n" } = $$props;
  const pathsByName = {
    arrow: [
      "M11.9019 0.618561C11.7176 0.69481 11.545 0.807839 11.3951 0.957646L0.457646 11.8951C-0.152549 12.5053 -0.152549 13.4947 0.457646 14.1049C1.06784 14.715 2.05716 14.715 2.66735 14.1049L10.9375 5.83471V23.9375C10.9375 24.8004 11.6371 25.5 12.5 25.5C13.3629 25.5 14.0625 24.8004 14.0625 23.9375V5.83471L22.3326 14.1049C22.9428 14.715 23.9322 14.715 24.5424 14.1049C25.1525 13.4947 25.1525 12.5053 24.5424 11.8951L13.6057 0.958487C13.6031 0.955925 13.6006 0.953368 13.598 0.950823C13.3158 0.672076 12.928 0.5 12.5 0.5C12.2881 0.5 12.0861 0.542165 11.9019 0.618561Z"
    ],
    chart: [
      "M25.5726 0.234706C26.0182 0.598493 26.0846 1.25469 25.7208 1.70036L15.825 13.8236C15.6272 14.066 15.3309 14.2066 15.0181 14.2066C14.7052 14.2066 14.4089 14.066 14.2111 13.8236L9.80974 8.43154L2.80422 17.0139C2.44043 17.4596 1.78424 17.526 1.33857 17.1622C0.892895 16.7984 0.826515 16.1422 1.1903 15.6965L9.00278 6.12555C9.20061 5.8832 9.49689 5.74258 9.80974 5.74258C10.1226 5.74258 10.4189 5.8832 10.6167 6.12555L15.0181 11.5176L24.1069 0.38297C24.4707 -0.0627016 25.1269 -0.129082 25.5726 0.234706Z",
      "M17.6221 1.04166C17.6221 0.466369 18.0884 0 18.6637 0H24.9137C25.489 0 25.9554 0.466369 25.9554 1.04166V8.69838C25.9554 9.27367 25.489 9.74004 24.9137 9.74004C24.3384 9.74004 23.8721 9.27367 23.8721 8.69838V2.08333H18.6637C18.0884 2.08333 17.6221 1.61696 17.6221 1.04166Z"
    ],
    download: [
      "M2.21191 15.4277C2.90227 15.4277 3.46191 15.9874 3.46191 16.6777V21.6777C3.46191 22.0093 3.59361 22.3272 3.82803 22.5616C4.06245 22.796 4.38039 22.9277 4.71191 22.9277H22.2119C22.5434 22.9277 22.8614 22.796 23.0958 22.5616C23.3302 22.3272 23.4619 22.0093 23.4619 21.6777V16.6777C23.4619 15.9874 24.0216 15.4277 24.7119 15.4277C25.4023 15.4277 25.9619 15.9874 25.9619 16.6777V21.6777C25.9619 22.6723 25.5668 23.6261 24.8636 24.3294C24.1603 25.0326 23.2065 25.4277 22.2119 25.4277H4.71191C3.71735 25.4277 2.76352 25.0326 2.06026 24.3294C1.357 23.6261 0.961914 22.6723 0.961914 21.6777V16.6777C0.961914 15.9874 1.52156 15.4277 2.21191 15.4277Z",
      "M6.32803 9.54385C6.81619 9.0557 7.60764 9.0557 8.0958 9.54385L13.4619 14.91L18.828 9.54385C19.3162 9.0557 20.1076 9.0557 20.5958 9.54385C21.084 10.032 21.084 10.8235 20.5958 11.3116L14.3458 17.5616C13.8576 18.0498 13.0662 18.0498 12.578 17.5616L6.32803 11.3116C5.83988 10.8235 5.83988 10.032 6.32803 9.54385Z",
      "M13.4619 0.427734C14.1523 0.427734 14.7119 0.987378 14.7119 1.67773V16.6777C14.7119 17.3681 14.1523 17.9277 13.4619 17.9277C12.7716 17.9277 12.2119 17.3681 12.2119 16.6777V1.67773C12.2119 0.987378 12.7716 0.427734 13.4619 0.427734Z"
    ],
    "logo-mark": [
      "M14.3204 1.32465C14.3204 1.73991 14.6571 2.07655 15.0723 2.07655C15.4876 2.07655 15.8242 1.73991 15.8242 1.32465C15.8242 0.909389 15.4876 0.572754 15.0723 0.572754C14.6571 0.572754 14.3204 0.909389 14.3204 1.32465ZM13.7566 6.02414C13.7566 6.75084 14.3457 7.33995 15.0724 7.33995C15.7991 7.33995 16.3882 6.75084 16.3882 6.02414C16.3882 5.29743 15.7991 4.70832 15.0724 4.70832C14.3457 4.70832 13.7566 5.29743 13.7566 6.02414ZM13.1926 10.7234C13.1926 11.7615 14.0342 12.6031 15.0723 12.6031C16.1105 12.6031 16.952 11.7615 16.952 10.7234C16.952 9.6852 16.1105 8.84361 15.0723 8.84361C14.0342 8.84361 13.1926 9.6852 13.1926 10.7234ZM13.1926 15.4226C13.1926 16.4608 14.0342 17.3024 15.0723 17.3024C16.1105 17.3024 16.952 16.4608 16.952 15.4226C16.952 14.3845 16.1105 13.5429 15.0723 13.5429C14.0342 13.5429 13.1926 14.3845 13.1926 15.4226ZM10.3727 12.6031C9.33456 12.6031 8.49298 11.7615 8.49298 10.7234C8.49298 9.6852 9.33456 8.84361 10.3727 8.84361C11.4108 8.84361 12.2524 9.6852 12.2524 10.7234C12.2524 11.7615 11.4108 12.6031 10.3727 12.6031ZM8.49298 15.4226C8.49298 16.4608 9.33456 17.3024 10.3727 17.3024C11.4108 17.3024 12.2524 16.4608 12.2524 15.4226C12.2524 14.3845 11.4108 13.5429 10.3727 13.5429C9.33456 13.5429 8.49298 14.3845 8.49298 15.4226ZM24.471 11.4754C24.0558 11.4754 23.7191 11.1387 23.7191 10.7235C23.7191 10.3082 24.0558 9.97157 24.471 9.97157C24.8863 9.97157 25.2229 10.3082 25.2229 10.7235C25.2229 11.1387 24.8863 11.4754 24.471 11.4754ZM23.7191 15.4227C23.7191 15.838 24.0558 16.1746 24.471 16.1746C24.8863 16.1746 25.2229 15.838 25.2229 15.4227C25.2229 15.0075 24.8863 14.6708 24.471 14.6708C24.0558 14.6708 23.7191 15.0075 23.7191 15.4227ZM19.7713 12.039C19.0446 12.039 18.4554 11.4498 18.4554 10.7231C18.4554 9.99643 19.0446 9.40732 19.7713 9.40732C20.498 9.40732 21.0871 9.99643 21.0871 10.7231C21.0871 11.4498 20.498 12.039 19.7713 12.039ZM18.4554 15.4227C18.4554 16.1494 19.0446 16.7385 19.7713 16.7385C20.498 16.7385 21.0871 16.1494 21.0871 15.4227C21.0871 14.696 20.498 14.1069 19.7713 14.1069C19.0446 14.1069 18.4554 14.696 18.4554 15.4227ZM5.67371 12.039C4.94701 12.039 4.3579 11.4498 4.3579 10.7231C4.3579 9.99643 4.94701 9.40732 5.67371 9.40732C6.40041 9.40732 6.98952 9.99643 6.98952 10.7231C6.98952 11.4498 6.40041 12.039 5.67371 12.039ZM10.3726 7.33995C9.64587 7.33995 9.05677 6.75084 9.05677 6.02414C9.05677 5.29743 9.64587 4.70832 10.3726 4.70832C11.0993 4.70832 11.6884 5.29743 11.6884 6.02414C11.6884 6.75084 11.0993 7.33995 10.3726 7.33995ZM10.3726 2.07655C9.95739 2.07655 9.62076 1.73991 9.62076 1.32465C9.62076 0.909389 9.95739 0.572754 10.3726 0.572754C10.7879 0.572754 11.1245 0.909389 11.1245 1.32465C11.1245 1.73991 10.7879 2.07655 10.3726 2.07655ZM18.7376 6.0243C18.7376 6.59528 19.2005 7.05816 19.7715 7.05816C20.3425 7.05816 20.8053 6.59528 20.8053 6.0243C20.8053 5.45332 20.3425 4.99044 19.7715 4.99044C19.2005 4.99044 18.7376 5.45332 18.7376 6.0243ZM5.67314 7.05816C5.10216 7.05816 4.63928 6.59528 4.63928 6.0243C4.63928 5.45332 5.10216 4.99044 5.67314 4.99044C6.24412 4.99044 6.70699 5.45332 6.70699 6.0243C6.70699 6.59528 6.24412 7.05816 5.67314 7.05816ZM13.7566 20.122C13.7566 20.8487 14.3457 21.4378 15.0724 21.4378C15.7991 21.4378 16.3882 20.8487 16.3882 20.122C16.3882 19.3952 15.7991 18.8061 15.0724 18.8061C14.3457 18.8061 13.7566 19.3952 13.7566 20.122ZM10.3726 21.4378C9.64587 21.4378 9.05677 20.8487 9.05677 20.122C9.05677 19.3952 9.64587 18.8061 10.3726 18.8061C11.0993 18.8061 11.6884 19.3952 11.6884 20.122C11.6884 20.8487 11.0993 21.4378 10.3726 21.4378ZM14.3204 24.8216C14.3204 25.2368 14.6571 25.5735 15.0723 25.5735C15.4876 25.5735 15.8242 25.2368 15.8242 24.8216C15.8242 24.4063 15.4876 24.0697 15.0723 24.0697C14.6571 24.0697 14.3204 24.4063 14.3204 24.8216ZM10.3726 25.5735C9.95739 25.5735 9.62076 25.2368 9.62076 24.8216C9.62076 24.4063 9.95739 24.0697 10.3726 24.0697C10.7879 24.0697 11.1245 24.4063 11.1245 24.8216C11.1245 25.2368 10.7879 25.5735 10.3726 25.5735ZM18.7376 20.1218C18.7376 20.6928 19.2005 21.1557 19.7715 21.1557C20.3425 21.1557 20.8053 20.6928 20.8053 20.1218C20.8053 19.5509 20.3425 19.088 19.7715 19.088C19.2005 19.088 18.7376 19.5509 18.7376 20.1218ZM5.67314 21.1557C5.10216 21.1557 4.63928 20.6928 4.63928 20.1218C4.63928 19.5509 5.10216 19.088 5.67314 19.088C6.24412 19.088 6.70699 19.5509 6.70699 20.1218C6.70699 20.6928 6.24412 21.1557 5.67314 21.1557ZM4.3579 15.4227C4.3579 16.1494 4.94701 16.7385 5.67371 16.7385C6.40041 16.7385 6.98952 16.1494 6.98952 15.4227C6.98952 14.696 6.40041 14.1069 5.67371 14.1069C4.94701 14.1069 4.3579 14.696 4.3579 15.4227ZM0.974784 11.4754C0.559525 11.4754 0.222893 11.1387 0.222893 10.7235C0.222893 10.3082 0.559525 9.97157 0.974784 9.97157C1.39004 9.97157 1.72667 10.3082 1.72667 10.7235C1.72667 11.1387 1.39004 11.4754 0.974784 11.4754ZM0.222893 15.4227C0.222893 15.838 0.559525 16.1746 0.974784 16.1746C1.39004 16.1746 1.72667 15.838 1.72667 15.4227C1.72667 15.0075 1.39004 14.6708 0.974784 14.6708C0.559525 14.6708 0.222893 15.0075 0.222893 15.4227Z"
    ],
    menu: [
      "M0 21.6667H25V18.8889H0V21.6667ZM0 14.7222H25V11.9444H0V14.7222ZM0 5V7.77778H25V5H0Z"
    ],
    money: [
      "M13.2917 0C13.867 0 14.3333 0.46637 14.3333 1.04167V23.9583C14.3333 24.5336 13.867 25 13.2917 25C12.7164 25 12.25 24.5336 12.25 23.9583V1.04167C12.25 0.46637 12.7164 0 13.2917 0Z",
      "M7.37294 5.53956C8.25201 4.66049 9.4443 4.16663 10.6875 4.16663H18.5C19.0753 4.16663 19.5417 4.633 19.5417 5.20829C19.5417 5.78359 19.0753 6.24996 18.5 6.24996H10.6875C9.99683 6.24996 9.33445 6.52433 8.84608 7.0127C8.3577 7.50108 8.08333 8.16346 8.08333 8.85413C8.08333 9.54479 8.3577 10.2072 8.84608 10.6955C9.33445 11.1839 9.99683 11.4583 10.6875 11.4583H15.8958C17.139 11.4583 18.3313 11.9522 19.2104 12.8312C20.0895 13.7103 20.5833 14.9026 20.5833 16.1458C20.5833 17.389 20.0895 18.5813 19.2104 19.4604C18.3313 20.3394 17.139 20.8333 15.8958 20.8333H7.04167C6.46637 20.8333 6 20.3669 6 19.7916C6 19.2163 6.46637 18.75 7.04167 18.75H15.8958C16.5865 18.75 17.2489 18.4756 17.7373 17.9872C18.2256 17.4988 18.5 16.8365 18.5 16.1458C18.5 15.4551 18.2256 14.7927 17.7373 14.3044C17.2489 13.816 16.5865 13.5416 15.8958 13.5416H10.6875C9.4443 13.5416 8.25201 13.0478 7.37294 12.1687C6.49386 11.2896 6 10.0973 6 8.85413C6 7.61092 6.49386 6.41864 7.37294 5.53956Z"
    ],
    pencil: [
      "M0 20.7899V25.9975H5.20761L20.5666 10.6386L15.359 5.43094L0 20.7899ZM24.5938 6.61133C25.1354 6.06974 25.1354 5.19486 24.5938 4.65327L21.3443 1.40372C20.8027 0.86213 19.9278 0.86213 19.3862 1.40372L16.8449 3.94504L22.0525 9.15265L24.5938 6.61133V6.61133Z"
    ],
    play: [
      "M2.15039 4.29245C2.15039 1.59772 5.1315 -0.029815 7.39825 1.42738L21.5358 10.5158C23.6214 11.8565 23.6214 14.9052 21.5358 16.2459L7.39825 25.3343C5.1315 26.7915 2.15039 25.164 2.15039 22.4693V4.29245Z"
    ],
    pause: [
      "M9.5 21.9092V3.15918C9.5 1.43329 8.10089 0.0341797 6.375 0.0341797C4.64911 0.0341797 3.25 1.43329 3.25 3.15918V21.9092C3.25 23.6351 4.64911 25.0342 6.375 25.0342C8.10089 25.0342 9.5 23.6351 9.5 21.9092Z",
      "M22 21.9092V3.15918C22 1.43329 20.6009 0.0341797 18.875 0.0341797C17.1491 0.0341797 15.75 1.43329 15.75 3.15918V21.9092C15.75 23.6351 17.1491 25.0342 18.875 25.0342C20.6009 25.0342 22 23.6351 22 21.9092Z"
    ],
    search: [
      "M2.50001 11.2501C2.50001 6.41754 6.41754 2.50001 11.2501 2.50001C16.0826 2.50001 20.0001 6.41754 20.0001 11.2501C20.0001 13.6071 19.0681 15.7464 17.5526 17.3197C17.5095 17.3528 17.4681 17.3891 17.4286 17.4286C17.3891 17.4681 17.3528 17.5095 17.3197 17.5526C15.7464 19.0681 13.6071 20.0001 11.2501 20.0001C6.41754 20.0001 2.50001 16.0826 2.50001 11.2501ZM18.2722 20.04C16.3476 21.5795 13.9063 22.5001 11.2501 22.5001C5.03682 22.5001 0 17.4633 0 11.2501C0 5.03682 5.03682 0 11.2501 0C17.4633 0 22.5001 5.03682 22.5001 11.2501C22.5001 13.9063 21.5795 16.3476 20.04 18.2722L24.6339 22.8661C25.122 23.3543 25.122 24.1457 24.6339 24.6339C24.1457 25.122 23.3543 25.122 22.8661 24.6339L18.2722 20.04Z"
    ],
    swoop: [
      "M17.6488 0.406796C17.1064 -0.135599 16.227 -0.135599 15.6846 0.406796C15.1422 0.949191 15.1422 1.82859 15.6846 2.37098L20.258 6.94444H6.94444C5.10266 6.94444 3.33632 7.67609 2.03398 8.97843C0.731644 10.2808 0 12.0471 0 13.8889V23.6111C0 24.3782 0.621827 25 1.38889 25C2.15595 25 2.77778 24.3782 2.77778 23.6111V13.8889C2.77778 12.7838 3.21676 11.724 3.99817 10.9426C4.77957 10.1612 5.83938 9.72222 6.94444 9.72222H20.258L15.6846 14.2957C15.1422 14.8381 15.1422 15.7175 15.6846 16.2599C16.227 16.8023 17.1064 16.8023 17.6488 16.2599L24.5932 9.31543C24.8611 9.04749 24.9967 8.69732 24.9999 8.34616C25 8.34189 25 8.33761 25 8.33333C25 8.32906 25 8.32478 24.9999 8.32051C24.9983 8.13686 24.961 7.96173 24.8946 7.80169C24.8268 7.63788 24.7264 7.4844 24.5932 7.35124L17.6488 0.406796Z"
    ],
    x: [
      "M24.8898 4.05647C25.7034 3.24288 25.7034 1.92379 24.8898 1.11019C24.0762 0.296602 22.7571 0.296602 21.9435 1.11019L13 10.0537L4.05647 1.11019C3.24288 0.296602 1.92379 0.296602 1.11019 1.11019C0.296602 1.92379 0.296602 3.24288 1.11019 4.05647L10.0537 13L1.11019 21.9435C0.296602 22.7571 0.296602 24.0762 1.11019 24.8898C1.92379 25.7034 3.24288 25.7034 4.05647 24.8898L13 15.9463L21.9435 24.8898C22.7571 25.7034 24.0762 25.7034 24.8898 24.8898C25.7034 24.0762 25.7034 22.7571 24.8898 21.9435L15.9463 13L24.8898 4.05647Z"
    ],
    facebook: [
      "M20.2949 0.110107H16.5449C14.8873 0.110107 13.2976 0.768588 12.1255 1.94069C10.9534 3.11279 10.2949 4.7025 10.2949 6.36011V10.1101H6.54492V15.1101H10.2949V25.1101H15.2949V15.1101H19.0449L20.2949 10.1101H15.2949V6.36011C15.2949 6.02859 15.4266 5.71064 15.661 5.47622C15.8955 5.2418 16.2134 5.11011 16.5449 5.11011H20.2949V0.110107Z"
    ],
    twitter: [
      "M25.7065 3.01887C24.6183 3.78646 23.4135 4.37354 22.1384 4.75751C21.454 3.97059 20.5444 3.41284 19.5327 3.1597C18.521 2.90656 17.456 2.97023 16.4816 3.34212C15.5073 3.714 14.6707 4.37615 14.0849 5.23901C13.4992 6.10186 13.1926 7.1238 13.2065 8.1666V9.30296C11.2095 9.35475 9.23072 8.91184 7.44633 8.0137C5.66193 7.11555 4.12736 5.79005 2.97927 4.15524C2.97927 4.15524 -1.56618 14.3825 8.66109 18.928C6.32078 20.5166 3.53286 21.3131 0.706543 21.2007C10.9338 26.8825 23.4338 21.2007 23.4338 8.13251C23.4328 7.81598 23.4023 7.50023 23.3429 7.18933C24.5027 6.04557 25.3211 4.6015 25.7065 3.01887V3.01887Z"
    ],
    instagram: [
      "M7.10138 3.17876C4.591 3.17876 2.55593 5.21383 2.55593 7.72422V19.0879C2.55593 21.5982 4.591 23.6333 7.10138 23.6333H18.465C20.9754 23.6333 23.0105 21.5982 23.0105 19.0879V7.72422C23.0105 5.21383 20.9754 3.17876 18.465 3.17876H7.10138ZM0.283203 7.72422C0.283203 3.95864 3.33581 0.906036 7.10138 0.906036H18.465C22.2306 0.906036 25.2832 3.95864 25.2832 7.72422V19.0879C25.2832 22.8534 22.2306 25.906 18.465 25.906H7.10138C3.33581 25.906 0.283203 22.8534 0.283203 19.0879V7.72422Z",
      "M13.3328 9.98466C12.6235 9.87948 11.8991 10.0006 11.2626 10.3309C10.6261 10.6611 10.11 11.1837 9.78758 11.8242C9.4652 12.4647 9.35299 13.1905 9.46691 13.8985C9.58083 14.6064 9.91508 15.2604 10.4221 15.7675C10.9291 16.2745 11.5832 16.6087 12.2911 16.7227C12.9991 16.8366 13.7249 16.7244 14.3654 16.402C15.0059 16.0796 15.5284 15.5635 15.8587 14.927C16.1889 14.2905 16.3101 13.5661 16.2049 12.8568C16.0976 12.1333 15.7605 11.4635 15.2433 10.9463C14.7261 10.4291 14.0563 10.0919 13.3328 9.98466ZM10.2158 8.31356C11.2766 7.76313 12.484 7.56121 13.6661 7.73651C14.872 7.91533 15.9884 8.47723 16.8504 9.33922C17.7123 10.2012 18.2743 11.3176 18.4531 12.5234C18.6284 13.7056 18.4264 14.913 17.876 15.9737C17.3256 17.0345 16.4547 17.8948 15.3872 18.4321C14.3197 18.9694 13.1099 19.1564 11.93 18.9665C10.7501 18.7767 9.66011 18.2196 8.81505 17.3745C7.96999 16.5295 7.41291 15.4395 7.22305 14.2595C7.03318 13.0796 7.2202 11.8699 7.7575 10.8024C8.29481 9.73488 9.15503 8.86398 10.2158 8.31356Z"
    ],
    email: [
      "M23.3457 3.40601H3.3457C1.9707 3.40601 0.858203 4.53101 0.858203 5.90601L0.845703 20.906C0.845703 22.281 1.9707 23.406 3.3457 23.406H23.3457C24.7207 23.406 25.8457 22.281 25.8457 20.906V5.90601C25.8457 4.53101 24.7207 3.40601 23.3457 3.40601ZM23.3457 8.40601L13.3457 14.656L3.3457 8.40601V5.90601L13.3457 12.156L23.3457 5.90601V8.40601Z"
    ],
    link: [
      "M3.29785 13.1093C3.29785 10.9718 5.03535 9.23425 7.17285 9.23425H12.1729V6.85925H7.17285C3.72285 6.85925 0.922852 9.65925 0.922852 13.1093C0.922852 16.5593 3.72285 19.3593 7.17285 19.3593H12.1729V16.9843H7.17285C5.03535 16.9843 3.29785 15.2468 3.29785 13.1093ZM8.42285 14.3593H18.4229V11.8593H8.42285V14.3593ZM19.6729 6.85925H14.6729V9.23425H19.6729C21.8104 9.23425 23.5479 10.9718 23.5479 13.1093C23.5479 15.2468 21.8104 16.9843 19.6729 16.9843H14.6729V19.3593H19.6729C23.1229 19.3593 25.9229 16.5593 25.9229 13.1093C25.9229 9.65925 23.1229 6.85925 19.6729 6.85925Z"
    ]
  };
  const directions = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.direction === void 0 && $$bindings.direction && direction !== void 0)
    $$bindings.direction(direction);
  $$result.css.add(css$a);
  paths = pathsByName[name] || [];
  rotation = directions.indexOf(direction) * 45;
  return `<svg class="${"c svelte-htwn2n"}" viewBox="${"0 0 25 25"}"${add_attribute("style", `transform: rotate(${rotation}deg)`, 0)}>${each(paths, (path) => `<path fill-rule="${"evenodd"}" clip-rule="${"evenodd"}"${add_attribute("d", path, 0)}></path>`)}</svg>`;
});
var Tweet_svelte_svelte_type_style_lang = "";
const css$9 = {
  code: ".tweet.svelte-r1b5fo{align-items:center;display:flex;justify-content:center;margin:-1em 0 0;min-height:15em;transform:scale(.9)}",
  map: null
};
const Tweet = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { id = "" } = $$props;
  let { options = {} } = $$props;
  let tweetElement;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  $$result.css.add(css$9);
  return `<div class="${"tweet svelte-r1b5fo"}"${add_attribute("this", tweetElement, 0)}></div>`;
});
var Number_svelte_svelte_type_style_lang = "";
const css$8 = {
  code: '.c.svelte-kq0dj9{font-feature-settings:"tnum" 1}',
  map: null
};
const Number_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cachedNumber;
  let formatFunction;
  const { format: d3Format, interpolate, timer: d3Timer } = d3;
  let { number = null } = $$props;
  let { format = ",.2f" } = $$props;
  let { duration = 300 } = $$props;
  let displayNumber = 0;
  const startInterpolate = () => {
    const interpolationFunction = interpolate(cachedNumber, number);
    const timer = d3Timer((timeElapsed) => {
      const t = timeElapsed / duration;
      displayNumber = interpolationFunction(t);
      if (t >= 1) {
        if (timer)
          timer.stop();
        displayNumber = number;
        cachedNumber = number;
      }
    });
  };
  if ($$props.number === void 0 && $$bindings.number && number !== void 0)
    $$bindings.number(number);
  if ($$props.format === void 0 && $$bindings.format && format !== void 0)
    $$bindings.format(format);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  $$result.css.add(css$8);
  cachedNumber = 0;
  formatFunction = (d) => {
    try {
      return typeof format == "string" ? d3Format(format)(d) : format(d);
    } catch (e) {
      console.log(e);
      return "-";
    }
  };
  {
    startInterpolate();
  }
  return `<span class="${"c svelte-kq0dj9"}">${escape(Number.isFinite && Number.isFinite(+displayNumber) ? formatFunction(displayNumber) : "-")}
</span>`;
});
const InView = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { root = void 0 } = $$props;
  let { isInViewProp = false } = $$props;
  let isInView = false;
  let element;
  if ($$props.root === void 0 && $$bindings.root && root !== void 0)
    $$bindings.root(root);
  if ($$props.isInViewProp === void 0 && $$bindings.isInViewProp && isInViewProp !== void 0)
    $$bindings.isInViewProp(isInViewProp);
  {
    isInViewProp = isInView;
  }
  return `<div class="${"c"}"${add_attribute("this", element, 0)}>${slots.default ? slots.default({ isInView }) : ``}</div>`;
});
var Scrubber_svelte_svelte_type_style_lang = "";
const css$7 = {
  code: ".scrubber.svelte-15uj77a{position:relative}.line.svelte-15uj77a{background:var(--a1);position:absolute}.line--x.svelte-15uj77a{bottom:0;left:-.5px;top:0;width:1px}.line--y.svelte-15uj77a{height:1px;left:0;right:0;top:-.5px}",
  map: null
};
const Scrubber = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { dimension = "x" } = $$props;
  let { progress = 0 } = $$props;
  let { doShowLine = false } = $$props;
  let height = 100;
  let scrubberElement;
  if ($$props.dimension === void 0 && $$bindings.dimension && dimension !== void 0)
    $$bindings.dimension(dimension);
  if ($$props.progress === void 0 && $$bindings.progress && progress !== void 0)
    $$bindings.progress(progress);
  if ($$props.doShowLine === void 0 && $$bindings.doShowLine && doShowLine !== void 0)
    $$bindings.doShowLine(doShowLine);
  $$result.css.add(css$7);
  return `<div class="${"scrubber svelte-15uj77a"}"${add_attribute("this", scrubberElement, 0)}>${slots.default ? slots.default({}) : ``}
  ${doShowLine ? `<div class="${"line line--" + escape(dimension) + " svelte-15uj77a"}" style="${"transform: translate" + escape(dimension.toUpperCase()) + "(" + escape(height * progress) + "px)"}"></div>` : ``}
</div>`;
});
var BucketedImage_svelte_svelte_type_style_lang = "";
const css$6 = {
  code: ".c.svelte-1adimej{overflow:hidden;position:relative}img.svelte-1adimej{left:0;position:absolute;top:0}",
  map: null
};
const BucketedImage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let xOffset;
  let yOffset;
  let scaleStatement;
  let { image = "" } = $$props;
  let { aspectRatio = 2 } = $$props;
  let { index = 0 } = $$props;
  let { dimension = "y" } = $$props;
  let { alt = "" } = $$props;
  let { numberOfFrames: numberOfFrames2 = 10 } = $$props;
  let { doFlip = false } = $$props;
  if ($$props.image === void 0 && $$bindings.image && image !== void 0)
    $$bindings.image(image);
  if ($$props.aspectRatio === void 0 && $$bindings.aspectRatio && aspectRatio !== void 0)
    $$bindings.aspectRatio(aspectRatio);
  if ($$props.index === void 0 && $$bindings.index && index !== void 0)
    $$bindings.index(index);
  if ($$props.dimension === void 0 && $$bindings.dimension && dimension !== void 0)
    $$bindings.dimension(dimension);
  if ($$props.alt === void 0 && $$bindings.alt && alt !== void 0)
    $$bindings.alt(alt);
  if ($$props.numberOfFrames === void 0 && $$bindings.numberOfFrames && numberOfFrames2 !== void 0)
    $$bindings.numberOfFrames(numberOfFrames2);
  if ($$props.doFlip === void 0 && $$bindings.doFlip && doFlip !== void 0)
    $$bindings.doFlip(doFlip);
  $$result.css.add(css$6);
  xOffset = dimension == "x" ? index * 100 / numberOfFrames2 : 0;
  yOffset = dimension == "y" ? index * 100 / numberOfFrames2 : 0;
  scaleStatement = doFlip ? dimension == "x" ? `scaleX(-1)` : `scaleY(-1)` : "";
  return `<div class="${"c svelte-1adimej"}" style="${"width: 100%; padding: " + escape(1 / aspectRatio / 2 * 100) + "%"}"><img${add_attribute("src", image, 0)}${add_attribute("alt", alt, 0)} style="${"width: 100%; height: " + escape(numberOfFrames2 * 100) + "%; transform: translate(" + escape(-xOffset) + "%, " + escape(-yOffset) + "%) " + escape(scaleStatement)}" class="${"svelte-1adimej"}">
</div>`;
});
function onInterval(callback, milliseconds) {
  let interval;
  const play = () => {
    interval = setInterval(callback, milliseconds);
  };
  const pause = () => {
    clearInterval(interval);
  };
  play();
  onDestroy(() => {
    pause();
  });
  return {
    interval,
    pause,
    play
  };
}
var PlayControls_svelte_svelte_type_style_lang = "";
const css$5 = {
  code: ".bar.svelte-1bwk42v{align-items:center;display:flex}button.svelte-1bwk42v{margin-right:1em}",
  map: null
};
const PlayControls = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { time = 0 } = $$props;
  let { rate = 0.05 } = $$props;
  let { frameRate = 60 } = $$props;
  let { isPlaying = true } = $$props;
  let { isHidden = false } = $$props;
  const tick = () => {
    time += rate;
    if (time > 1)
      time = 0;
    if (time < 0)
      time = 0;
  };
  const { interval, pause, play } = onInterval(tick, frameRate);
  const onIsPlayingChange = () => {
    if (isPlaying) {
      play();
    } else {
      pause();
    }
  };
  if ($$props.time === void 0 && $$bindings.time && time !== void 0)
    $$bindings.time(time);
  if ($$props.rate === void 0 && $$bindings.rate && rate !== void 0)
    $$bindings.rate(rate);
  if ($$props.frameRate === void 0 && $$bindings.frameRate && frameRate !== void 0)
    $$bindings.frameRate(frameRate);
  if ($$props.isPlaying === void 0 && $$bindings.isPlaying && isPlaying !== void 0)
    $$bindings.isPlaying(isPlaying);
  if ($$props.isHidden === void 0 && $$bindings.isHidden && isHidden !== void 0)
    $$bindings.isHidden(isHidden);
  $$result.css.add(css$5);
  {
    onIsPlayingChange();
  }
  return `${!isHidden ? `<div class="${"bar svelte-1bwk42v"}">${!isPlaying ? `<button class="${"svelte-1bwk42v"}">${validate_component(Icon, "Icon").$$render($$result, { name: "play" }, {}, {})}</button>` : `<button class="${"svelte-1bwk42v"}">${validate_component(Icon, "Icon").$$render($$result, { name: "pause" }, {}, {})}</button>`}
    ${slots.default ? slots.default({}) : ``}</div>` : `${slots.default ? slots.default({}) : ``}`}`;
});
var DualScrubber_svelte_svelte_type_style_lang = "";
const css$4 = {
  code: ".c.svelte-10dqs2y.svelte-10dqs2y{display:flex}.left.svelte-10dqs2y.svelte-10dqs2y{flex:1;margin-right:1em}.right.svelte-10dqs2y.svelte-10dqs2y{flex:1;position:relative}.top.svelte-10dqs2y.svelte-10dqs2y{align-items:center;display:flex;height:3em;line-height:1.3em;margin-bottom:.3em}.top.svelte-10dqs2y span.svelte-10dqs2y span{font-weight:800}.slice.svelte-10dqs2y span.svelte-10dqs2y span{padding-left:.2em}.annotation.svelte-10dqs2y.svelte-10dqs2y{bottom:.5em;color:var(--a3);font-size:.9em;font-weight:700;letter-spacing:.06em;position:absolute;right:1em;text-transform:uppercase;z-index:10}@media(max-width:500px){.c.svelte-10dqs2y.svelte-10dqs2y{flex-direction:column}.right.svelte-10dqs2y.svelte-10dqs2y{margin-top:.6em}}",
  map: null
};
const DualScrubber = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let leftFrameIndex;
  let rightFrameIndex;
  let isInView = false;
  let { leftImage = "/motionillusionblog/orangGifAsImg.jpeg" } = $$props;
  let { rightImage = "/motionillusionblog/buckets.jpg" } = $$props;
  let { playRate = 0.05 } = $$props;
  let { playFrameRate = 60 } = $$props;
  let { numberOfFrames: numberOfFrames2 = 24 - 1 } = $$props;
  let { numberOfBuckets = 270 / 5 - 1 } = $$props;
  let { leftAspectRatio = 480 / 270 } = $$props;
  let { rightAspectRatio = 480 / 24 / 11.25 } = $$props;
  let leftProgress = 0.5;
  let rightProgress = 0;
  let isPlaying = false;
  const onIsInViewChange = () => {
    setTimeout(() => {
      isPlaying = isInView;
    });
  };
  if ($$props.leftImage === void 0 && $$bindings.leftImage && leftImage !== void 0)
    $$bindings.leftImage(leftImage);
  if ($$props.rightImage === void 0 && $$bindings.rightImage && rightImage !== void 0)
    $$bindings.rightImage(rightImage);
  if ($$props.playRate === void 0 && $$bindings.playRate && playRate !== void 0)
    $$bindings.playRate(playRate);
  if ($$props.playFrameRate === void 0 && $$bindings.playFrameRate && playFrameRate !== void 0)
    $$bindings.playFrameRate(playFrameRate);
  if ($$props.numberOfFrames === void 0 && $$bindings.numberOfFrames && numberOfFrames2 !== void 0)
    $$bindings.numberOfFrames(numberOfFrames2);
  if ($$props.numberOfBuckets === void 0 && $$bindings.numberOfBuckets && numberOfBuckets !== void 0)
    $$bindings.numberOfBuckets(numberOfBuckets);
  if ($$props.leftAspectRatio === void 0 && $$bindings.leftAspectRatio && leftAspectRatio !== void 0)
    $$bindings.leftAspectRatio(leftAspectRatio);
  if ($$props.rightAspectRatio === void 0 && $$bindings.rightAspectRatio && rightAspectRatio !== void 0)
    $$bindings.rightAspectRatio(rightAspectRatio);
  $$result.css.add(css$4);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      onIsInViewChange();
    }
    leftFrameIndex = Math.floor(numberOfFrames2 * rightProgress);
    rightFrameIndex = Math.floor(numberOfBuckets * leftProgress);
    $$rendered = `${validate_component(InView, "InView").$$render($$result, { isInViewProp: isInView }, {
      isInViewProp: ($$value) => {
        isInView = $$value;
        $$settled = false;
      }
    }, {
      default: () => `<div class="${"c svelte-10dqs2y"}"><div class="${"left svelte-10dqs2y"}"><div class="${"top svelte-10dqs2y"}">${validate_component(PlayControls, "PlayControls").$$render($$result, {
        rate: playRate,
        frameRate: playFrameRate,
        time: rightProgress,
        isPlaying
      }, {
        time: ($$value) => {
          rightProgress = $$value;
          $$settled = false;
        },
        isPlaying: ($$value) => {
          isPlaying = $$value;
          $$settled = false;
        }
      }, {
        default: () => `<div class="${"frame"}"><span class="${"svelte-10dqs2y"}"><strong>Video</strong>
              at frame
              ${validate_component(Number_1, "Number").$$render($$result, {
          number: leftFrameIndex + 1,
          format: ".0f"
        }, {}, {})}</span></div>`
      })}</div>
      ${validate_component(Scrubber, "Scrubber").$$render($$result, {
        dimension: "y",
        doShowLine: true,
        progress: leftProgress
      }, {
        progress: ($$value) => {
          leftProgress = $$value;
          $$settled = false;
        }
      }, {
        default: () => `${validate_component(BucketedImage, "BucketedImage").$$render($$result, {
          image: leftImage,
          aspectRatio: leftAspectRatio,
          numberOfFrames: numberOfFrames2,
          index: leftFrameIndex,
          alt: "The video"
        }, {}, {})}`
      })}</div>
    <div class="${"right svelte-10dqs2y"}"><div class="${"top slice svelte-10dqs2y"}"><span class="${"svelte-10dqs2y"}"><strong>Slices through time</strong>
          at vertical position
          ${validate_component(Number_1, "Number").$$render($$result, {
        number: rightFrameIndex + 1,
        format: ".0f"
      }, {}, {})}</span></div>
      <div>${validate_component(Scrubber, "Scrubber").$$render($$result, {
        dimension: "y",
        doShowLine: true,
        progress: rightProgress
      }, {
        progress: ($$value) => {
          rightProgress = $$value;
          $$settled = false;
        }
      }, {
        default: () => `${validate_component(BucketedImage, "BucketedImage").$$render($$result, {
          image: rightImage,
          aspectRatio: rightAspectRatio,
          numberOfFrames: numberOfBuckets,
          index: rightFrameIndex,
          alt: "Slices of the video"
        }, {}, {})}`
      })}
        <div class="${"annotation svelte-10dqs2y"}">Time
          ${validate_component(Icon, "Icon").$$render($$result, { name: "arrow", direction: "s" }, {}, {})}</div></div></div></div>`
    })}`;
  } while (!$$settled);
  return $$rendered;
});
var OrangutanScrubber_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: ".c.svelte-c0f3sq{margin:2em 0}",
  map: null
};
const OrangutanScrubber = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);
  return `<div class="${"c svelte-c0f3sq"}">${validate_component(DualScrubber, "DualScrubber").$$render($$result, {
    leftImage: "/motionillusionblog/orangGifAsImg.jpeg",
    rightImage: "/motionillusionblog/buckets.jpg",
    numberOfFrames: 24,
    numberOfBuckets: 270 / 5,
    leftAspectRatio: 480 / 270,
    rightAspectRatio: 480 / 24 / 11.25
  }, {}, {})}
</div>`;
});
var OrangutanFrames_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: '.c.svelte-1ut4e6s{margin:2em auto;max-width:30em}strong.svelte-1ut4e6s{font-feature-settings:"tnum" 1;font-weight:700}',
  map: null
};
const numberOfFrames = 24;
const OrangutanFrames = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let frameIndex;
  let time = 0;
  let isInView = true;
  let isPlaying = false;
  const onIsInViewChange = () => {
    setTimeout(() => {
      isPlaying = isInView;
    });
  };
  $$result.css.add(css$2);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      onIsInViewChange();
    }
    frameIndex = Math.floor(time * numberOfFrames / (numberOfFrames / 4)) * (numberOfFrames / 4);
    $$rendered = `${validate_component(InView, "InView").$$render($$result, { isInViewProp: isInView }, {
      isInViewProp: ($$value) => {
        isInView = $$value;
        $$settled = false;
      }
    }, {
      default: () => `<div class="${"c svelte-1ut4e6s"}">${validate_component(PlayControls, "PlayControls").$$render($$result, {
        rate: 0.1,
        frameRate: 500,
        isHidden: true,
        time,
        isPlaying
      }, {
        time: ($$value) => {
          time = $$value;
          $$settled = false;
        },
        isPlaying: ($$value) => {
          isPlaying = $$value;
          $$settled = false;
        }
      }, {
        default: () => `<div class="${"frame"}"><span><strong class="${"svelte-1ut4e6s"}">Video</strong>
          at frame
          <strong class="${"svelte-1ut4e6s"}">${escape(frameIndex + 1)}</strong></span></div>`
      })}
    ${validate_component(BucketedImage, "BucketedImage").$$render($$result, {
        image: "/motionillusionblog/orangGifAsImg.jpeg",
        aspectRatio: 480 / 270,
        numberOfFrames,
        index: frameIndex,
        alt: "Orangutan swinging"
      }, {}, {})}</div>`
    })}`;
  } while (!$$settled);
  return $$rendered;
});
var MarioScrubber_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".c.svelte-hm2hf0{margin:2em auto;max-width:30em}",
  map: null
};
const MarioScrubber = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<div class="${"c svelte-hm2hf0"}">${validate_component(DualScrubber, "DualScrubber").$$render($$result, {
    leftImage: "/motionillusionblog/mariocrop_GifAsImg.jpeg",
    rightImage: "/motionillusionblog/mariocrop_buckets.jpeg",
    numberOfFrames: 60,
    numberOfBuckets: 244 / 5,
    leftAspectRatio: 244 / 244,
    rightAspectRatio: 244 / 244,
    playRate: 0.016,
    playFrameRate: 100
  }, {}, {})}
</div>`;
});
var BarScrubber_svelte_svelte_type_style_lang = "";
const css = {
  code: ".c.svelte-hm2hf0{margin:2em auto;max-width:30em}",
  map: null
};
const BarScrubber = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="${"c svelte-hm2hf0"}">${validate_component(DualScrubber, "DualScrubber").$$render($$result, {
    leftImage: "/motionillusionblog/1Dbars_GifAsImg.jpeg",
    rightImage: "/motionillusionblog/1Dbars_buckets.jpeg",
    numberOfFrames: 60,
    numberOfBuckets: 240 / 5,
    leftAspectRatio: 240 / 240,
    rightAspectRatio: 240 / 240,
    playRate: 0.016,
    playFrameRate: 100
  }, {}, {})}
</div>`;
});
const metadata = {
  "title": "Motion Illusions",
  "date": "2020-12-6",
  "description": "The one in which we talk about motion"
};
const Motion_illusions = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<p>There have been a lot of visual motion illusions going around Twitter recently. I think it is super cool that people find these motion demos so compelling. However, I\u2019ve been surprised to see lots of claims that there is \u201Cno motion\u201D in the illusions and most people seem to think there\u2019s some perceptual magic going on.</p>
<p>What is this magic?</p>
<h2 id="${"for-example-this-crazy-mario-illusion"}">For example, this crazy mario illusion</h2>
<p>The marios look like they\u2019re moving throughout the level, but each mario never gets anywhere. It\u2019s really quite upsetting.</p>
<video src="${"/motionillusionblog/marioReversePhi.mp4"}" autoplay loop muted style="${"max-width: min(100%, 30em)"}"></video>
<p>A number of people have expressed wonder at this example, pointing out that \u201Cnothing is actually moving\u201D.</p>
${validate_component(Tweet, "Tweet").$$render($$result, { id: "1335266992228626432" }, {}, {})}
<p>And it follows in a whole series of really clever illusions that use the same effect, but are often designed to mislead the observer.</p>
${validate_component(Tweet, "Tweet").$$render($$result, { id: "1331674290937327617" }, {}, {})}
<h2 id="${"how-do-these-illusions-work"}">How do these illusions work?</h2>
<p>I thought this was a good opportunity to write up a little blog post about
visual motion. Let\u2019s take this Mario example here and look at what\u2019s actually
going on.</p>
<h3 id="${"but-first-what-is-motion"}">But first, what is motion?</h3>
<p>Motion is <strong>change in position over time</strong>.</p>
<p>Something that does not move is static because it has the same position as time
progresses. We often think of motion in the real world: furniture does not
change position over time (does not move). You, your dog, all animals, your
limbs, all change position over time. So, they move in the world.</p>
<p>However, from the perspective from your visual system (or a video camera), motion isn\u2019t so
straightforward. For example, if I were to pan a camera across a room, the room
would be moving with respect to the reference frame of the camera. That is
motion as well. In other words, <strong>visual motion is not just a result of things
moving in the world, but can also result from the sensor moving</strong>.</p>
<p>So, what is
visual motion and how do we see it? Let\u2019s take the idea of something changing
position over time in the real world and apply it to the pixels of a movie. You\u2019ll see this makes
sense in a minute. Here\u2019s a video of a real moving thing swinging.</p>
<video src="${"/motionillusionblog/orangutanVid.mp4"}" autoplay loop muted style="${"max-width: min(100%, 30em)"}"></video>

<p style="${"text-align: center; margin: -1.4em 0 2em"}">from <a href="${"https://giphy.com/search/monkey-swing"}">Giphy</a></p>
<p>What makes this a video of a moving thing?
Well, if we look at different frames, we can see the position of the orangutan
has moved over time.</p>
${validate_component(OrangutanFrames, "OrangutanFrames").$$render($$result, {}, {}, {})}
<p>That tells us that the orangutan has moved, even with a fixed reference frame (the camera has not moved). Therefore the orangutan has moved in the real world.</p>
<p>One way to visualize this would be to <strong>plot the pixel values over time to see how they change</strong>. Since we cannot
plot every frame at all time points, let\u2019s take a slice through space and look
how that slice changes over time. You can move your mouse (scrub) over the 2D
image frame to see different space-time slices.</p>
<p>Scrub over the space-time slice to play through time in the movie. It won\u2019t be intuitive at first, but there is
a mapping from the motion of objects in the images to the patterns in the space
x time slices. Specifically, motion is orientation\u2026</p>

${validate_component(OrangutanScrubber, "OrangutanScrubber").$$render($$result, {}, {}, {})}
<p>Track the body of the orangutan and the branch. You can see that the movement of the orangutan and the branch form slanted structure in
the space-time plots, whereas the background looks like vertical streaks.</p>
<img src="${"/motionillusionblog/orangannotated.png"}" alt="${"Orangutan Space-time Annotations"}">
<p>It\u2019s a little tricky to see at first, but it\u2019s clear which things are moving and which are not. All of the slanted (or \u201Coriented\u201D) stuff in the space-time slice is stuff that\u2019s moving. In other words, we can define \u201CVisual Motion\u201D as orientation in space-time.</p>
<ul><li><p><strong>Vertical structure</strong> in space-time does not move.</p></li>
<li><p><strong>Horizontal structure</strong> in space-time, such as the edge of the leaves here, are appearances and disappearances.</p></li></ul>
<p>The TLDR of this whole post is: <strong>Our visual system detects orientation in space-time to see motion using little local detectors.</strong></p>
<p>But before we get into that, what\u2019s happening with the Marios? Is there orientation there as well?</p>
<h2 id="${"whats-happening-with-the-marios"}">What\u2019s happening with the marios?</h2>
<p>Above, we built a quick intuition for how visual motion is really just orientation in space-time. Let\u2019s zoom in on a single Mario
to see what happens if we use the same trick. Here is a single mario. It appears
to be moving to the right, but it never leaves the frame. This is the essential
component of the illusion.</p>
<video src="${"/motionillusionblog/MarioCropped.mp4"}" autoplay loop muted style="${"max-width: min(100%, 60em)"}"></video>
<p>If we take a slice through this mario, we can use the intuitions we learned above to see what\u2019s going on. In this figure, time is running up.</p>

${validate_component(MarioScrubber, "MarioScrubber").$$render($$result, {}, {}, {})}
<p>First, the mario is flashing different colors. That appears as horizontal
rainbow-colored lines. Horizontal structure in space-time plots (where time runs
up or down) is something appearing or disappearing (or, flashing!).</p>
<p>Second, in this view, we can clearly see where the motion comes from. There is oriented structure on the edges of the marios. Although there is a hard edge between the
colors and the gray that is vertical (and therefore does not move), the colors
are oriented at the edge.</p>
<img src="${"/motionillusionblog/coloredgeannotated.png"}" alt="${"Annotated Space-time slice"}" style="${"max-width: min(100%, 10em); display: block;"}">
<p><strong>The color has nothing to do with the illusion</strong> - let\u2019s rid of it for now because it\u2019s just a distraction. Here you\u2019ll see the same Mario in grayscale
(I\u2019ve just averaged across the color channels) and you can still see the effect.</p>
<video src="${"/motionillusionblog/MarioGray.mp4"}" autoplay loop muted style="${"width: 10em; max-width: min(100%, 60em)"}"></video>
<p>From here, we can construct a really simple illusion
that follows the same principles. We\u2019ll build an image that represents space-time
and then play it back as a 2D movie.</p>
<p>The image I\u2019ll make here is constructed using the same principle as the Mario\u2019s edge. The center is modulated in brightness, just like
the Mario\u2019s color was modulated. The edges drift to the right for 5 frames and
then jump back to the start. At each jump, the sign inverts and the cycle starts
again. Before scrolling down, <strong>try to imagine what this looks like if we played it as a movie</strong>.</p>
<img src="${"/motionillusionblog/constructedspacetime.png"}" alt="${"Constructed Space Time Slice"}" style="${"max-width: min(100%, 20em); display: block;"}">
<p>Since there is only 1D space in our
image from above, we don\u2019t have a 2D image at each time point. But, we can
visualize that 1D info as vertical bars.</p>
<p>Here\u2019s a single frame of our new
illusion.</p>
<img src="${"/motionillusionblog/constructedframe.png"}" alt="${"Constructed Space Time Frame"}" style="${"max-width: min(100%, 20em); display: block;"}">
<p>And here\u2019s the full movie of our space-time constructed object.</p>
${validate_component(BarScrubber, "BarScrubber").$$render($$result, {}, {}, {})}

<p>If we look back at the space-time construction again, we can see something interesting. There is an
edge moving to the right, but it keeps jumping back and changing sign (white is
on ones side and black on the other and then it flips).</p>
<img src="${"/motionillusionblog/grayannotated.png"}" alt="${"Orangutan Space-time Annotations"}" style="${"max-width: min(100%, 40em); display: block;"}">
<p>But we keep seeing motion to the right. <strong>This tells us something: our visual motion system doesn\u2019t
care about the sign of that edge.</strong> The lingo that vision scientists use to talk about
this is <em>motion perception doesn\u2019t care about phase</em> (for the purposes of this
blog post, phase is just the exact sign and position of that edge).</p>
<p>In other words, <strong>motion perception only cares about the orientation</strong>, not the stuff it\u2019s
made of. And that\u2019s pretty neat.</p>
<p>Next, let\u2019s look at an old model of visual motion processing with this property.</p>
<h2 id="${"the-motion-energy-model"}">The motion energy model</h2>
<p>Let\u2019s look at the state-of-the-art in human motion perception (in the mid 1980s),
also known as the \u201D<a href="${"http://persci.mit.edu/pub_pdfs/spatio85.pdf"}" rel="${"nofollow"}">motion energy model</a>\u201D. This is really a beautiful
paper, so I recommend anyone interest click in and take the time to read it.
Also, not all that much has changed in our understanding of the fundamentals in
the last 35 years.</p>
<p>So, how does human motion detectors work? Adelson and Bergen
start by making the same point that was demonstrated above: visual motion is
orientation in space-time. Panel <strong>a</strong> shows a frame of a movie with a bar
moving to the right (like our orangutan, above). <strong>b</strong> shows the full
spatiotemporal volume of the bar moving through space and time as if it were
continuously moving. But, of course, movies have frames and a frame rate. Panel
<strong>c</strong> shows the same volume, but now it reflects the frame rate of a movie.</p>
<img src="${"/motionillusionblog/AdelsonBergenMotionOrientation.png"}" alt="${"Motion as edge orientation"}" style="${"max-width: min(100%, 40em); margin: 2em auto; display: block;"}">
<p>From here, it makes sense to think about how to build detectors for motion. The
picture below shows that if you had an oriented filter in space time, you could
detect the edge. For the non-scientists reading this, you can think of these filters like little \u201Cedge detectors\u201D. These types of oriented filters are decent enough descriptions of the responses of neurons in visual cortex. For example, here\u2019s a <a href="${"https://www.youtube.com/watch?v=Cw5PKV9Rj3o&feature=emb_title"}" rel="${"nofollow"}">link to a video</a> of what
Hubel and Wiesel found in their classic experiments on primary visual cortex, which they concluded looks like a little line (or edge) detector.</p>
<img src="${"/motionillusionblog/AdelsonBergenEdgeDetector.png"}" alt="${"Motion as edge detectors"}" style="${"max-width: min(100%, 40em); margin: 2em auto; display: block;"}">
Importantly, these edge detectors still care about the sign of the edge. This,
as we noted above, is unlike our percept. To build detectors that do not care
about phase (don&#39;t care about the polarity of the edge). We can combine two oriented filters that care about opposite signs. In technical terms, these filters are 90\xB0 out of phase, forming a &quot;Quadrature Pair&quot;. Really don&#39;t worry about that jargon. This just means that where one filter _likes_ white, the other _likes_ black (and vice versa).
<img src="${"/motionillusionblog/AdelsonBergenQpair.png"}" alt="${"Phase-invariant filters"}" style="${"max-width: min(100%, 20em); margin: 2em auto; display: block;"}">
<blockquote><p>Note: A very <a href="${"https://www.osapublishing.org/DirectPDFAccess/4E69228F-07D1-9374-DF04DF81D3560F3A_1949/josaa-2-2-322.pdf?da=1&id=1949&seq=0&mobile=no"}" rel="${"nofollow"}">related paper</a>
from Watson and Ahumada came out in the same year and covers many of the same
points.</p></blockquote>
<p>Using the equations from Adelson and Bergen, 1985, we can make the same
little motion energy filters. Note: in my visualization below, time runs up.</p>
<p>The two filters on the right are selective to and edge moving to the right and are 90\xB0 out of phase with eachother.
The two filters on the left are selective to a leftward moving edge and are 90\xB0 out of phase with each other.</p>
<img src="${"/motionillusionblog/adelsonOrientedFilters.png"}" alt="${"Phase-invariant filters for left and right"}" style="${"max-width: min(100%, 30em); margin: 2em auto; display: block;"}">
<p>Here\u2019s a movie of what these look like:</p>
<video src="${"/motionillusionblog/motEfilters.mp4"}" autoplay loop muted style="${"max-width: min(100%, 30em)"}"></video>
<p>Let\u2019s pause for a second here and take note of two things:</p>
<ol><li>These little movies look a lot like what the edges of the marios do. So, <strong>contrary to the claim that the marios are \u201Cnot moving\u201D they are, in fact, made up of the fundamental elements of motion</strong>.</li>
<li>Derivatives</li></ol>
<h3 id="${"what-derivatives"}">What? Derivatives?</h3>
<p>How did Adelson and Bergen make these little moving edge detectors? Well, the key underlying component is the concept of a derivative. The spatial selectivity of these filters was created by taking the 1st and 2nd derivatives of a Gaussian.</p>
<p>The first idea to get across is that derivatives detect change (that\u2019s basically the definition). The derivative of a function <span class="${"math math-inline"}"><span class="${"katex"}"><span class="${"katex-html"}" aria-hidden="${"true"}"><span class="${"base"}"><span class="${"strut"}" style="${"height:1.2251079999999999em;vertical-align:-0.345em;"}"></span><span class="${"mord"}"><span class="${"mopen nulldelimiter"}"></span><span class="${"mfrac"}"><span class="${"vlist-t vlist-t2"}"><span class="${"vlist-r"}"><span class="${"vlist"}" style="${"height:0.8801079999999999em;"}"><span style="${"top:-2.6550000000000002em;"}"><span class="${"pstrut"}" style="${"height:3em;"}"></span><span class="${"sizing reset-size6 size3 mtight"}"><span class="${"mord mtight"}"><span class="${"mord mtight"}" style="${"margin-right:0.05556em;"}">\u2202</span><span class="${"mord mathnormal mtight"}">x</span></span></span></span><span style="${"top:-3.23em;"}"><span class="${"pstrut"}" style="${"height:3em;"}"></span><span class="${"frac-line"}" style="${"border-bottom-width:0.04em;"}"></span></span><span style="${"top:-3.394em;"}"><span class="${"pstrut"}" style="${"height:3em;"}"></span><span class="${"sizing reset-size6 size3 mtight"}"><span class="${"mord mtight"}"><span class="${"mord mtight"}" style="${"margin-right:0.05556em;"}">\u2202</span></span></span></span></span><span class="${"vlist-s"}">\u200B</span></span><span class="${"vlist-r"}"><span class="${"vlist"}" style="${"height:0.345em;"}"><span></span></span></span></span></span><span class="${"mclose nulldelimiter"}"></span></span><span class="${"mord mathnormal"}" style="${"margin-right:0.10764em;"}">f</span><span class="${"mopen"}">(</span><span class="${"mord mathnormal"}">x</span><span class="${"mclose"}">)</span></span></span></span></span> is how much the function value (<span class="${"math math-inline"}"><span class="${"katex"}"><span class="${"katex-html"}" aria-hidden="${"true"}"><span class="${"base"}"><span class="${"strut"}" style="${"height:1em;vertical-align:-0.25em;"}"></span><span class="${"mord mathnormal"}" style="${"margin-right:0.10764em;"}">f</span><span class="${"mopen"}">(</span><span class="${"mord mathnormal"}">x</span><span class="${"mclose"}">)</span></span></span></span></span>) changes for really small changes in <span class="${"math math-inline"}"><span class="${"katex"}"><span class="${"katex-html"}" aria-hidden="${"true"}"><span class="${"base"}"><span class="${"strut"}" style="${"height:0.43056em;vertical-align:0em;"}"></span><span class="${"mord mathnormal"}">x</span></span></span></span></span>. That <span class="${"math math-inline"}"><span class="${"katex"}"><span class="${"katex-html"}" aria-hidden="${"true"}"><span class="${"base"}"><span class="${"strut"}" style="${"height:0.69444em;vertical-align:0em;"}"></span><span class="${"mord"}" style="${"margin-right:0.05556em;"}">\u2202</span><span class="${"mord mathnormal"}">x</span></span></span></span></span> just means \u201Ctiny changes in x\u201D.</p>
<p>Intuitively then, something that moves will have to change as a function of changes in space, <span class="${"math math-inline"}"><span class="${"katex"}"><span class="${"katex-html"}" aria-hidden="${"true"}"><span class="${"base"}"><span class="${"strut"}" style="${"height:0.69444em;vertical-align:0em;"}"></span><span class="${"mord"}" style="${"margin-right:0.05556em;"}">\u2202</span><span class="${"mord mathnormal"}">x</span></span></span></span></span>, and time, <span class="${"math math-inline"}"><span class="${"katex"}"><span class="${"katex-html"}" aria-hidden="${"true"}"><span class="${"base"}"><span class="${"strut"}" style="${"height:0.69444em;vertical-align:0em;"}"></span><span class="${"mord"}" style="${"margin-right:0.05556em;"}">\u2202</span><span class="${"mord mathnormal"}">t</span></span></span></span></span>. A derivative filter is designed to detect those changes. And we can make a smooth one by starting with a smooth,localized, function and taking its derivative.</p>
<p>A Gaussian is a smooth bump spatially and taking the derivative can create the type of edge detector that Adelson and Bergen wanted to make. Here\u2019s what that looks like. Note: I\u2019ve normalized both curves to have the same amplitude.</p>
<img src="${"/motionillusionblog/gaussianderivative.png"}" alt="${"Gaussian Derivative"}" style="${"max-width: min(100%, 20em); margin: 2em auto; display: block;"}">
<p>So, one way to make a little \u201Cedge detector\u201D is a derivative filter. Thinking of early vision in terms of little derivatives is <a href="${"http://persci.mit.edu/pub_pdfs/elements91.pdf"}" rel="${"nofollow"}">really useful</a>.</p>
<h2 id="${"motion-energy-model-on-the-marios"}">Motion Energy Model on \u201Cthe Marios\u201D</h2>
<p><strong>So, is there motion in \u201Cthe Marios\u201D illusion?</strong> Let\u2019s use the motion energy model to find out. Below, I\u2019m going to play a movie of the cropped mario with the output of the motion energy model colored by the cardinal directions (using the following colors)</p>
<img src="${"/motionillusionblog/motionlegendtitle.png"}" alt="${"Motion Energy Legend"}" style="${"max-width: min(100%, 10em); margin: 2em auto; display: block;"}">
<p>Remember, the Mario we cropped looked like it was moving to the right.</p>
<video src="${"/motionillusionblog/MarioGray.mp4"}" autoplay loop muted style="${"width: 10em; max-width: min(100%, 60em)"}"></video>
<p>And the motion energy model agrees: Mario is moving to the right.</p>
<video src="${"/motionillusionblog/MarioCropped_motE_1.mp4"}" autoplay loop muted style="${"max-width: min(100%, 20em)"}"></video>
<p>We can see a couple cool things from this movie:</p>
<ol><li><strong>Rightward motion is only detected along the vertical edges</strong>. This is consistent with a principle that motion can only be encoded in the direction perpendicular to the orientation of an edge.</li>
<li><strong>There is some detected motion upwards and downwards at the top and bottom of the marios</strong>. This is also consistent with the point about edges made above.</li></ol>
<p>Our local motion detectors can\u2019t integrate motion over large parts of space, so they only \u201Csee\u201D the local signals at edges.</p>
<p>Let\u2019s look at what happens with the full Mario illusion:</p>
<video src="${"/motionillusionblog/MarioReversePhi_motE_1.mp4"}" autoplay loop muted style="${"max-width: min(100%, 40em)"}"></video>
<p>The motion energy model agrees (mostly) with our percept of the Marios. One issue visualizing it this way is that the colors mask the edges which kills the illusion. So, let\u2019s just look at the average motion energy over time:</p>
<img src="${"/motionillusionblog/MarioReversePhi_Adelson1.png"}" alt="${"Motion Energy Marios"}" style="${"max-width: min(100%, 40em); margin: 2em auto; display: block;"}">
<h2 id="${"conclusions"}">Conclusions</h2>
<p>Alright, so now that we took this whirlwind tour of visual motion perception applied to motion illusions. What did we learn?</p>
<h3 id="${"1-visual-motion-can-be-thought-of-as-orientation-in-space-time"}">1. Visual Motion can be thought of as orientation in space-time</h3>
<p>Because motion is defined by changes in space over time, it will appear as oriented structure when looking at space-time slices of a movie.</p>
<h3 id="${"2-human-motion-perception-works-by-integrating-across-little-motion-detectors-that-do-not-care-about-phase"}">2. Human motion perception works by integrating across little motion detectors that do not care about phase</h3>
<p>We see the marios as \u201Cmoving\u201D because they are. They are made of little space-time oriented elements at the edges. Our visual system detects those little local motion elements elements and does not care about the polarity of the edge as it moves (which is why the flashing of the marios doesn\u2019t disrupt the perception of constant motion).</p>
<h3 id="${"3-we-can-make-simple-motion-detectors-that-have-the-properties-of-human-vision"}">3. We can make simple motion detectors that have the properties of human vision</h3>
<p>The Adelson Bergen <strong>\u201CMotion Energy Model\u201D</strong> showed us a simple way to construct motion detectors that don\u2019t care about the polarity of an edge.</p>
<h3 id="${"4-the-motion-energy-model-sees-motion-in-the-marios-just-like-we-do"}">4. The motion energy model \u201Csees\u201D motion in the marios just like we do</h3>
<p>When we ran the motion energy model on the mario stimulus, those filters from the 1980s predict the same motion that we see. I\u2019d say this a different way. The marios are constructed using these fundamental elements of motion. So, yea, they\u2019re totally moving. They just aren\u2019t going anywhere. And, yes, I know what people mean when they say \u201Cnothing is moving\u201D.</p>
<h3 id="${"5-human-vision-relies-on-change"}">5. Human vision relies on change</h3>
<p>The motion energy filters we made were constructed using derivative filters. Derivatives are all about change. A large change in space is an edge. A large change in time is an appearance or disappearance. A change in both space and time is motion. Early vision mostly measures changes. That means your perception is going to be dependent on signals that are reflecting changes.</p>
<h3 id="${"finally-some-interesting-perspectives-on-twitter"}">Finally, some interesting perspectives on Twitter\u2026</h3>
<p>Some other people have pointed out the strong effect of the edges for seeing object motion.</p>
${validate_component(Tweet, "Tweet").$$render($$result, { id: "1331678121976684544" }, {}, {})}
<p>I think another way of saying this is that early vision works with <a href="${"http://persci.mit.edu/pub_pdfs/elements91.pdf"}" rel="${"nofollow"}">derivatives</a>, and high-level vision can only integrate those signals. So it kinda makes sense that high-level percepts would depend so much on edges.</p>
<p>Additionally, some people report being able to modulate whether they see the motion or not.</p>
${validate_component(Tweet, "Tweet").$$render($$result, { id: "1335302102957006848" }, {}, {})}
<p>I\u2019m not quite sure about the interpretation regarding \u201Csense of self\u201D, but I can also modulate how big the effect is. One trivial way to do this is to move my eyes to different locations. If I look well off the marios, there is no perceived motion. But that\u2019s not what this Tweet was about.</p>
<p>If I try hard enough (and I\u2019m not sure exactly what I\u2019m doing), I can get the effect to go away. I have two ideas about this. The first is that maybe I\u2019m doing something weird with my fixational eye movements or accommodation. The second option is that I\u2019m playing with my attentional readout of the low-level sensory signals. There\u2019s no getting around what\u2019s in the video (there is motion energy), so to be able to modulate this has something to do with how it\u2019s integrated.</p>
<h2 id="${"update-does-flownet2-match-our-perception"}">Update: Does Flownet2 match our perception?</h2>
<p>Flownet2 is the latest version of Deep Learning\u2019s answer to optic flow. For our intents and purposes here <em>optic flow</em> just means <em>visual motion</em>. The paper describing the model is <a href="${"https://arxiv.org/abs/1612.01925"}" rel="${"nofollow"}">here</a> and NVIDIA have kindly provided a <a href="${"https://github.com/NVIDIA/flownet2-pytorch"}" rel="${"nofollow"}">pytorch implementation</a>. I haven\u2019t had much time to play with the full model, and I\u2019m currently limited to frame width that cropped my original video, but it\u2019s already producing interesting and VERY different output than Adelson Bergen.</p>
<p>Here\u2019s a video visualizing the optic flow produced by FlowNet2 in the mario illusion and comparing that to Adelson Bergen:</p>
<video src="${"/motionillusionblog/marioreversephi_flownetcomp.mp4"}" autoplay loop muted style="${"max-width: min(100%, 40em)"}"></video>
<p>First off, flownet looks beautiful, but it totally fails to capture the illusion. I haven\u2019t had a chance to try other versions of the model, but this is not a win for modern machine learning. Adelson Bergen, on the other hand, captures the perceptual effect well. I think I\u2019ll do a deep dive into flownet in the future and see whether there is evidence for phase invariance, or why it is so blobby and full of flicker. Anyway, for now, it\u2019s nice to see that such a simple model from the 1980s performs so well on this \u201Ctask\u201D. Makes you wonder whether building in some of these principled constraints would make flownet match human perception more closely.</p>`;
});
export { Motion_illusions as default, metadata };
