import { EnumBureausShorts } from "../models/enums";
import {
  IImportAccountHistory,
  IImportCreditInquiry,
  IImportCreditScore,
  IImportCreditSummary,
  IImportPersonalDetails,
  IImportPublicRecords,
  IImportReportStats,
} from "../models/interfaces/importer";

export class ImporterUtils {
  static getPublicFieldValue(
    record: IImportPublicRecords,
    fieldName: string,
    bureauShort: string
  ): string {
    const param: any = record?.publicRecordSummary?.find((x) =>
      x?.publicRecordParam?.toLowerCase()?.includes(fieldName)
    );
    const valField = "publicRecordParamValue" + bureauShort;
    return param
      ? !!param[valField]
        ? param[valField]?.toString()?.trim()
        : ""
      : "";
  }
  static getHistoryFieldValue(
    history: IImportAccountHistory,
    fieldName: string,
    bureauShort: string
  ): string {
    const param: any = history?.Summary?.find((x) =>
      x?.accountParam?.toLowerCase()?.includes(fieldName)
    );
    const valField = "accountParamValue" + bureauShort;
    return param
      ? !!param[valField]
        ? param[valField]?.toString()?.trim()
        : ""
      : "";
  }
  static getSummaryFieldValue(
    summaryData: IImportCreditSummary[] | null,
    fieldName: string,
    bureauShort: string
  ): string {
    const param: any = summaryData?.find((x) =>
      x.creditParam?.toLowerCase()?.includes(fieldName)
    );
    const valField = "creditParamValue" + bureauShort;
    return param
      ? !!param[valField]
        ? param[valField]?.toString()?.trim()
        : ""
      : "";
  }

  static IsBureauAccountNegative(
    history: IImportAccountHistory,
    bureauShort: string
  ) {
    const { accttype, acctstatus, pastdue, status, comments } =
      this.getBureauWiseValue(history, bureauShort);

    return (
      this.IsFieldValueNegative(accttype.toLowerCase(), "AcctType") ||
      this.IsFieldValueNegative(acctstatus.toLowerCase(), "AcctStatus") ||
      this.IsFieldValueNegative(pastdue?.trim(), "PastDue") ||
      this.IsFieldValueNegative(status.toLowerCase(), "PayStatus") ||
      this.IsFieldValueNegative(comments.toLowerCase(), "Comments")
    );
  }
  static getBureauWiseValue(
    history: IImportAccountHistory,
    bureauShort: string
  ) {
    const accttype = this.getHistoryFieldValue(
      history,
      "account type",
      bureauShort
    );
    const acctstatus = this.getHistoryFieldValue(
      history,
      "account status",
      bureauShort
    );
    const pastdue = this.getHistoryFieldValue(history, "past due", bureauShort)
      ?.replace(/\$/g, "")
      ?.replace(/\,/g, "")
      ?.replace(/-/g, "");
    const status = this.getHistoryFieldValue(
      history,
      "payment status",
      bureauShort
    );
    const comments = this.getHistoryFieldValue(history, "comment", bureauShort);

    return { accttype, acctstatus, pastdue, status, comments };
  }
  static IsFieldValueNegative(item: string, fieldtype: string) {
    let isnegative = false;
    if (fieldtype === "AcctStatus" && item === "settled") {
      isnegative = true;
    } else if (
      fieldtype === "PastDue" &&
      item !== "" &&
      item !== "$0" &&
      item !== "-" &&
      item !== "$0.00" &&
      item !== "0" &&
      item !== "0.00"
    ) {
      isnegative = true;
    }
    if (
      fieldtype === "PayStatus" &&
      (item === "chargeoff or collection" ||
        item === "repossession or foreclosure" ||
        item === "payment plan" ||
        item === "30 days late" ||
        item === "60 days late" ||
        item === "90 days late" ||
        item === "120 days late" ||
        item === "past due 60 days" ||
        item === "past due 180 days" ||
        item === "charged off as bad debt" ||
        item === "bad debt & placed for collection & skip" ||
        item ===
          "seriously past due date / assigned to attorney, collection agency, or credit grantor's internal collection department" ||
        item === "at least 120 days or more than four payments past due" ||
        item === "unpaid" ||
        item === "120 days past due" ||
        item === "paid, was a charge-off" ||
        item === "paid, was past due 30 days")
    ) {
      isnegative = true;
    } else if (
      fieldtype === "Comments" &&
      (item === "settlement accepted on this account" ||
        item === "settled less than full balance" ||
        item === "paying under a partial payment agreement" ||
        item === "paying partial payment agreement" ||
        item === "collateral: bankruptcy chapter 7" ||
        item === "chapter 7 bankruptcy" ||
        item === "bankruptcy chapter 7" ||
        item === "charged off account" ||
        item === "foreclosure proceedings started" ||
        item === "foreclosure process started" ||
        item === "foreclosure initiated" ||
        item === "paid profit and loss" ||
        item === "profit and loss writeoff" ||
        item === "collection account" ||
        item === "placed for collection" ||
        item === "bankruptcy/dispute of account information" ||
        item === "unpaid" ||
        item.indexOf("written-off") >= 0 ||
        item === "involuntary repossession auto")
    ) {
      isnegative = true;
    } else if (
      fieldtype === "AcctType" &&
      (item === "collection account" ||
        item === "collection department / agency / attorney")
    ) {
      isnegative = true;
    }
    return isnegative;
  }

  static IsBureauAccountQuestionable(
    history: IImportAccountHistory,
    bureauShort: string
  ) {
    let acctstatus = this.getHistoryFieldValue(
      history,
      "account status",
      bureauShort
    );
    let comments = this.getHistoryFieldValue(history, "comment", bureauShort);

    return (
      this.IsFieldValueQuestionable(
        acctstatus?.trim().toLowerCase(),
        "AcctStatus"
      ) ||
      this.IsFieldValueQuestionable(comments?.trim()?.toLowerCase(), "Comments")
    );
  }
  static IsFieldValueQuestionable(item: string, fieldtype: string) {
    let isquestionable = false;
    if (fieldtype === "AcctStatus" && item === "lost or stolen") {
      isquestionable = true;
    } else if (
      fieldtype === "Comments" &&
      (item === "canceled by credit grantor" ||
        item === "closed due to inactivity" ||
        item === "account closed by credit grantor" ||
        item === "credit card lost or stolen" ||
        item.toLowerCase().indexOf("sldto") >= 0)
    ) {
      isquestionable = true;
    }
    return isquestionable;
  }
  static IsCollectionAgencyReportingInnacurate(name: string, accttype: string) {
    return (
      accttype === "open" &&
      [
        "pinnacle credit servic",
        "pinnacle",
        "pin cred ser",
        "debt recovery solution",
        "debtrecsol",
        "debt rec sol",
        "collectech diversified",
        "portfolio recovery ass",
        "portfolio",
        "portfolio rc",
        "enhanced recovery co l",
        "enhanced recovery co",
        "enhancrcvrco",
        "focus mgmt",
        "focus receivables mana",
        "focus receivables ma",
        "midland funding",
        "midlandmcm",
        "midland fund",
        "receivables performanc",
        "receivables performa",
        "rcvl per mng",
        "cach llc",
        "cach, llc",
        "foxcollectent",
      ]?.includes(name)
    );
  }
  static IsQuestionableAccount(item: string, fieldtype: string) {
    let isquestionable = false;
    if (fieldtype === "AcctStatus") {
      if (item === "lost or stolen") {
        isquestionable = true;
      }
    }
    if (fieldtype === "Comments") {
      if (
        item === "canceled by credit grantor" ||
        item === "closed due to inactivity" ||
        item === "account closed by credit grantor" ||
        item === "credit card lost or stolen" ||
        item.toLowerCase().indexOf("sldto") >= 0
      ) {
        isquestionable = true;
      }
    }
    return isquestionable;
  }
  static AnalyzeAccounts({
    historyData,
    inquiriesData,
    publicRecordData,
  }: any): IImportReportStats {
    let numexpinquiriestoimport = 0;
    let numeqfinquiriestoimport = 0;
    let numtuinquiriestoimport = 0;

    let numexpaccountstoimport = 0;
    let numeqfaccountstoimport = 0;
    let numtuaccountstoimport = 0;

    let numexppubrecstoimport = 0;
    let numeqfpubrecstoimport = 0;
    let numtupubrecstoimport = 0;

    let numexpneg = 0;
    let numeqfneg = 0;
    let numtuneg = 0;
    let numexpquest = 0;
    let numeqfquest = 0;
    let numtuquest = 0;

    historyData?.forEach((account: IImportAccountHistory, index: number) => {
      if (this.IsBureauAccountNegative(account, EnumBureausShorts.EXP)) {
        numexpneg = numexpneg + 1;
      }
      if (this.IsBureauAccountQuestionable(account, EnumBureausShorts.EXP)) {
        numexpquest = numexpquest + 1;
      }

      const expacctnum = this.getHistoryFieldValue(
        account,
        "account #",
        EnumBureausShorts.EXP
      );
      const expacctname = this.getHistoryFieldValue(
        account,
        "account name",
        EnumBureausShorts.EXP
      );

      if (expacctname !== "" || expacctnum !== "") {
        numexpaccountstoimport = numexpaccountstoimport + 1;
      }

      if (this.IsBureauAccountNegative(account, EnumBureausShorts.EQF)) {
        numeqfneg = numeqfneg + 1;
      }

      if (this.IsBureauAccountQuestionable(account, EnumBureausShorts.EQF)) {
        numeqfquest = numeqfquest + 1;
      }

      const eqfacctnum = this.getHistoryFieldValue(
        account,
        "account #",
        EnumBureausShorts.EQF
      );
      const eqfacctname = this.getHistoryFieldValue(
        account,
        "account name",
        EnumBureausShorts.EQF
      );
      //if eqf listing set num eqf count
      if (eqfacctname !== "" || eqfacctnum !== "") {
        numeqfaccountstoimport = numeqfaccountstoimport + 1;
      }
      if (this.IsBureauAccountNegative(account, EnumBureausShorts.TU)) {
        numtuneg = numtuneg + 1;
      }
      if (this.IsBureauAccountQuestionable(account, EnumBureausShorts.TU)) {
        numtuquest = numtuquest + 1;
      }

      const tuacctnum = this.getHistoryFieldValue(
        account,
        "account #",
        EnumBureausShorts.TU
      );
      const tuacctname = this.getHistoryFieldValue(
        account,
        "account name",
        EnumBureausShorts.TU
      );

      if (tuacctname !== "" || tuacctnum !== "") {
        numtuaccountstoimport = numtuaccountstoimport + 1;
      }
    });

    inquiriesData?.forEach((inquiry: IImportCreditInquiry) => {
      if (inquiry?.CheckedEXP) {
        numexpinquiriestoimport = numexpinquiriestoimport + 1;
      }
      if (inquiry?.CheckedEQF) {
        numeqfinquiriestoimport = numeqfinquiriestoimport + 1;
      }
      if (inquiry?.CheckedTU) {
        numtuinquiriestoimport = numtuinquiriestoimport + 1;
      }
    });

    publicRecordData?.forEach((record: IImportPublicRecords, index: number) => {
      let expdatefiled = this.getPublicFieldValue(
        record,
        "filed/reported",
        EnumBureausShorts.EXP
      );
      let expamount = this.getPublicFieldValue(
        record,
        "asset amount",
        EnumBureausShorts.EXP
      );
      let expcasenum = this.getPublicFieldValue(
        record,
        "reference",
        EnumBureausShorts.EXP
      );
      let eqfdatefiled = this.getPublicFieldValue(
        record,
        "filed/reported",
        EnumBureausShorts.EQF
      );
      let eqfamount = this.getPublicFieldValue(
        record,
        "asset amount",
        EnumBureausShorts.EQF
      );
      let eqfcasenum = this.getPublicFieldValue(
        record,
        "reference",
        EnumBureausShorts.EQF
      );
      let tudatefiled = this.getPublicFieldValue(
        record,
        "filed/reported",
        EnumBureausShorts.TU
      );
      let tuamount = this.getPublicFieldValue(
        record,
        "asset amount",
        EnumBureausShorts.TU
      );
      let tucasenum = this.getPublicFieldValue(
        record,
        "reference",
        EnumBureausShorts.TU
      );

      if (expdatefiled !== "" || expamount !== "" || expcasenum !== "") {
        numexppubrecstoimport++;
      }
      if (eqfdatefiled !== "" || eqfamount !== "" || eqfcasenum !== "") {
        numeqfpubrecstoimport++;
      }
      if (tudatefiled !== "" || tuamount !== "" || tucasenum !== "") {
        numtupubrecstoimport++;
      }
    });

    return {
      numexpinquiriestoimport,
      numeqfinquiriestoimport,
      numtuinquiriestoimport,
      numexpaccountstoimport,
      numeqfaccountstoimport,
      numtuaccountstoimport,
      numexppubrecstoimport,
      numeqfpubrecstoimport,
      numtupubrecstoimport,
      numexpneg,
      numeqfneg,
      numtuneg,
      numexpquest,
      numeqfquest,
      numtuquest,
    };
  }
  static parsePersonalDetail(data: any): IImportPersonalDetails {
    return {}; // json dont have data for this section so leave it as empty
  }
  static parsePersonalDetailArray(data: any): IImportPersonalDetails {
    const TUData = this.getPersonalDetailsForBureau(
      data?.CREDIT_FILE,
      "TransUnion"
    );
    const EXPData = this.getPersonalDetailsForBureau(
      data?.CREDIT_FILE,
      "Experian"
    );
    const EQFData = this.getPersonalDetailsForBureau(
      data?.CREDIT_FILE,
      "Equifax"
    );
    return {
      crDateTU: TUData?.reportDate,
      crDateEXP: EXPData?.reportDate,
      crDateEQF: EQFData?.reportDate,
      NameTU: TUData?.fullName,
      NameEXP: EXPData?.fullName,
      NameEQF: EQFData?.fullName,
      KnownAsTU: TUData?.alias,
      KnownAsEXP: EXPData?.alias,
      KnownAsEQF: EQFData?.alias,
      formerTU: TUData?.former,
      formerEXP: EXPData?.former,
      formerEQF: EQFData?.former,
      DOBTU: TUData?.dob,
      DOBEXP: EXPData?.dob,
      DOBEQF: EQFData?.dob,
      CurrAddressTU: TUData?.currentAddress,
      CurrAddressEXP: EXPData?.currentAddress,
      CurrAddressEQF: EQFData?.currentAddress,
      PrevAddressesTU: TUData?.previousAddresses,
      PrevAddressesEXP: EXPData?.previousAddresses,
      PrevAddressesEQF: EQFData?.previousAddresses,
      CurrentEmployerTU: TUData?.employers,
      CurrentEmployerEXP: EXPData?.employers,
      CurrentEmployerEQF: EQFData?.employers,
      AlertTU: TUData?.alerts,
      AlertEXP: EXPData?.alerts,
      AlertEQF: EQFData?.alerts,
    };
  }
  static parseCreditDetail(data: any): IImportCreditScore {
    const score =
      (data?.borrower?.length && data.borrower[0].creditScore) || null;
    const expScore = score?.find((x: any) => x.source.bureau.symbol === "EXP");
    const eqfScore = score?.find((x: any) => x.source.bureau.symbol === "EQF");
    const tuScore = score?.find((x: any) => x.source.bureau.symbol === "TUC");
    return {
      CreditScoreTU: tuScore?.riskScore,
      CreditScoreEXP: expScore?.riskScore,
      CreditScoreEQF: eqfScore?.riskScore,
      RankTU: tuScore?.populationRank,
      RankEXP: expScore?.populationRank,
      RankEQF: eqfScore?.populationRank,
      ScoreScaleTU: tuScore?.scoreName,
      ScoreScaleEXP: expScore?.scoreName,
      ScoreScaleEQF: eqfScore?.scoreName,
    } as IImportCreditScore;
  }
  static parseCreditDetailArray(data: any): IImportCreditScore {
    const TUData =
      data["CREDIT_SCORE"]?.find(
        (x: any) => x["@CreditRepositorySourceType"] === "TransUnion"
      ) || {};
    const EXPData =
      data["CREDIT_SCORE"]?.find(
        (x: any) => x["@CreditRepositorySourceType"] === "Experian"
      ) || {};
    const EQFData =
      data["CREDIT_SCORE"]?.find(
        (x: any) => x["@CreditRepositorySourceType"] === "Equifax"
      ) || {};
    return {
      CreditScoreTU: TUData["@_Value"],
      CreditScoreEXP: EXPData["@_Value"],
      CreditScoreEQF: EQFData["@_Value"],
      RankTU: "",
      RankEXP: "",
      RankEQF: "",
      ScoreScaleTU:
        TUData["@RiskBasedPricingMin"] + "-" + TUData["@RiskBasedPricingMax"],
      ScoreScaleEXP:
        EXPData["@RiskBasedPricingMin"] + "-" + EXPData["@RiskBasedPricingMax"],
      ScoreScaleEQF:
        EQFData["@RiskBasedPricingMin"] + "-" + EQFData["@RiskBasedPricingMax"],
    } as IImportCreditScore;
  }
  static parseSummaryDetail(data: any): IImportCreditSummary[] {
    let summary = data?.summary?.tradelineSummary || null;
    let _creditlist = [] as IImportCreditSummary[];
    if (summary) {
      let inquirySummary = data?.summary?.inquirySummary || null;
      let publicRecordSummary = data?.summary?.publicRecordSummary || null;
      let expSummary = summary?.experian;
      let eqfSummary = summary?.equifax;
      let tuSummary = summary?.transUnion;
      let creditsumary = {
        creditParam: "Total Accounts:",
        creditParamValueTU: tuSummary?.totalAccounts,
        creditParamValueEXP: expSummary?.totalAccounts,
        creditParamValueEQF: eqfSummary?.totalAccounts,
      };
      _creditlist.push(creditsumary);
      creditsumary = {
        creditParam: "Open Accounts:",
        creditParamValueTU: tuSummary?.openAccounts,
        creditParamValueEXP: expSummary?.openAccounts,
        creditParamValueEQF: eqfSummary?.openAccounts,
      };
      _creditlist.push(creditsumary);
      creditsumary = {
        creditParam: "Closed Accounts:",
        creditParamValueTU: tuSummary?.closeAccounts,
        creditParamValueEXP: expSummary?.closeAccounts,
        creditParamValueEQF: eqfSummary?.closeAccounts,
      };
      _creditlist.push(creditsumary);
      creditsumary = {
        creditParam: "Delinquent:",
        creditParamValueTU: tuSummary?.delinquentAccounts,
        creditParamValueEXP: expSummary?.delinquentAccounts,
        creditParamValueEQF: eqfSummary?.delinquentAccounts,
      };
      _creditlist.push(creditsumary);
      creditsumary = {
        creditParam: "Derogatory:",
        creditParamValueTU: tuSummary?.derogatoryAccounts,
        creditParamValueEXP: expSummary?.derogatoryAccounts,
        creditParamValueEQF: eqfSummary?.derogatoryAccounts,
      };
      _creditlist.push(creditsumary);
      creditsumary = {
        creditParam: "Collection:",
        creditParamValueTU: "",
        creditParamValueEXP: "",
        creditParamValueEQF: "",
      };
      _creditlist.push(creditsumary);
      creditsumary = {
        creditParam: "Balances:",
        creditParamValueTU: "$" + (tuSummary?.totalBalances || 0),
        creditParamValueEXP: "$" + (expSummary?.totalBalances || 0),
        creditParamValueEQF: "$" + (eqfSummary?.totalBalances || 0),
      };
      _creditlist.push(creditsumary);
      creditsumary = {
        creditParam: "Payments:",
        creditParamValueTU: "$" + (tuSummary?.totalMonthlyPayments || 0),
        creditParamValueEXP: "$" + (expSummary?.totalMonthlyPayments || 0),
        creditParamValueEQF: "$" + (eqfSummary?.totalMonthlyPayments || 0),
      };
      _creditlist.push(creditsumary);
      creditsumary = {
        creditParam: "Public Records:",
        creditParamValueTU: publicRecordSummary?.transUnion?.numberOfRecords,
        creditParamValueEXP: publicRecordSummary?.experian?.numberOfRecords,
        creditParamValueEQF: publicRecordSummary?.equifax?.numberOfRecords,
      };
      _creditlist.push(creditsumary);
      creditsumary = {
        creditParam: "Inquiries(2 years):",
        creditParamValueTU: inquirySummary?.transUnion?.numberInLast2Years,
        creditParamValueEXP: inquirySummary?.experian?.numberInLast2Years,
        creditParamValueEQF: inquirySummary?.equifax?.numberInLast2Years,
      };
      _creditlist.push(creditsumary);
    }
    return _creditlist;
  }
  static parseSummaryDetailArray(data: any): IImportCreditSummary[] {
    let summary =
      data?.CREDIT_SUMMARY_TUI?._DATA_SET ||
      data?.CREDIT_SUMMARY_XPN?._DATA_SET ||
      data?.CREDIT_SUMMARY_EFX?._DATA_SET ||
      null;
    let _creditlist = [] as IImportCreditSummary[];
    if (summary) {
      let expSummary = data?.CREDIT_SUMMARY_XPN?._DATA_SET;
      let eqfSummary = data?.CREDIT_SUMMARY_EFX?._DATA_SET;
      let tuSummary = data?.CREDIT_SUMMARY_TUI?._DATA_SET;
      let creditsumaryTotal = {
        creditParam: "Total Accounts:",
        creditParamValueTU: this.handleExceptionNumber(
          tuSummary?.find((x: any) => x["@_ID"] === "AP001")["@_Value"]
        ),
        creditParamValueEXP: this.handleExceptionNumber(
          expSummary?.find((x: any) => x["@_ID"] === "AP001")["@_Value"]
        ),
        creditParamValueEQF: this.handleExceptionNumber(
          eqfSummary?.find((x: any) => x["@_ID"] === "AP001")["@_Value"]
        ),
      };
      _creditlist.push(creditsumaryTotal);
      let creditsumaryOpened = {
        creditParam: "Open Accounts:",
        creditParamValueTU: this.handleExceptionNumber(
          tuSummary?.find((x: any) => x["@_ID"] === "AT02S")["@_Value"]
        ),
        creditParamValueEXP: this.handleExceptionNumber(
          expSummary?.find((x: any) => x["@_ID"] === "AT02S")["@_Value"]
        ),
        creditParamValueEQF: this.handleExceptionNumber(
          eqfSummary?.find((x: any) => x["@_ID"] === "AT02S")["@_Value"]
        ),
      };
      _creditlist.push(creditsumaryOpened);
      let creditsumary = {
        creditParam: "Closed Accounts:",
        creditParamValueTU: (
          creditsumaryTotal?.creditParamValueTU -
          creditsumaryOpened?.creditParamValueTU
        ).toString(),
        creditParamValueEXP: (
          creditsumaryTotal?.creditParamValueEXP -
          creditsumaryOpened?.creditParamValueEXP
        ).toString(),
        creditParamValueEQF: (
          creditsumaryTotal?.creditParamValueEQF -
          creditsumaryOpened?.creditParamValueEQF
        ).toString(),
      };
      _creditlist.push(creditsumary);
      creditsumary = {
        creditParam: "Delinquent:",
        creditParamValueTU: this.handleExceptionNumber(
          tuSummary?.find((x: any) => x["@_ID"] === "PT063")["@_Value"]
        ),
        creditParamValueEXP: this.handleExceptionNumber(
          expSummary?.find((x: any) => x["@_ID"] === "PT063")["@_Value"]
        ),
        creditParamValueEQF: this.handleExceptionNumber(
          eqfSummary?.find((x: any) => x["@_ID"] === "PT063")["@_Value"]
        ),
      };
      _creditlist.push(creditsumary);
      creditsumary = {
        creditParam: "Derogatory:",
        creditParamValueTU: this.handleExceptionNumber(
          tuSummary?.find((x: any) => x["@_ID"] === "AP008")["@_Value"]
        ),
        creditParamValueEXP: this.handleExceptionNumber(
          expSummary?.find((x: any) => x["@_ID"] === "AP008")["@_Value"]
        ),
        creditParamValueEQF: this.handleExceptionNumber(
          eqfSummary?.find((x: any) => x["@_ID"] === "AP008")["@_Value"]
        ),
      };
      _creditlist.push(creditsumary);
      creditsumary = {
        creditParam: "Collection:",
        creditParamValueTU: this.handleExceptionNumber(
          tuSummary?.find((x: any) => x["@_ID"] === "S068A")["@_Value"]
        ),
        creditParamValueEXP: this.handleExceptionNumber(
          expSummary?.find((x: any) => x["@_ID"] === "S068A")["@_Value"]
        ),
        creditParamValueEQF: this.handleExceptionNumber(
          eqfSummary?.find((x: any) => x["@_ID"] === "S068A")["@_Value"]
        ),
      };
      _creditlist.push(creditsumary);
      creditsumary = {
        creditParam: "Balances:",
        creditParamValueTU:
          "$" +
          (this.handleExceptionNumber(
            tuSummary?.find((x: any) => x["@_ID"] === "PT056")["@_Value"]
          ) +
            this.handleExceptionNumber(
              tuSummary?.find((x: any) => x["@_ID"] === "PT132")["@_Value"]
            )),
        creditParamValueEXP:
          "$" +
          (this.handleExceptionNumber(
            expSummary?.find((x: any) => x["@_ID"] === "PT056")["@_Value"]
          ) +
            this.handleExceptionNumber(
              expSummary?.find((x: any) => x["@_ID"] === "PT132")["@_Value"]
            )),
        creditParamValueEQF:
          "$" +
          (this.handleExceptionNumber(
            eqfSummary?.find((x: any) => x["@_ID"] === "PT056")["@_Value"]
          ) +
            this.handleExceptionNumber(
              eqfSummary?.find((x: any) => x["@_ID"] === "PT132")["@_Value"]
            )),
      };
      _creditlist.push(creditsumary);
      creditsumary = {
        creditParam: "Payments:",
        creditParamValueTU:
          "$" +
          this.handleExceptionNumber(
            tuSummary?.find((x: any) => x["@_ID"] === "ATAP01")["@_Value"]
          ),
        creditParamValueEXP:
          "$" +
          this.handleExceptionNumber(
            expSummary?.find((x: any) => x["@_ID"] === "ATAP01")["@_Value"]
          ),
        creditParamValueEQF:
          "$" +
          this.handleExceptionNumber(
            eqfSummary?.find((x: any) => x["@_ID"] === "ATAP01")["@_Value"]
          ),
      };
      _creditlist.push(creditsumary);
      creditsumary = {
        creditParam: "Public Records:",
        creditParamValueTU: this.handleExceptionNumber(
          tuSummary?.find((x: any) => x["@_ID"] === "G093S")["@_Value"]
        ),
        creditParamValueEXP: this.handleExceptionNumber(
          expSummary?.find((x: any) => x["@_ID"] === "G093S")["@_Value"]
        ),
        creditParamValueEQF: this.handleExceptionNumber(
          eqfSummary?.find((x: any) => x["@_ID"] === "G093S")["@_Value"]
        ),
      };
      _creditlist.push(creditsumary);
      creditsumary = {
        creditParam: "Inquiries(2 years):",
        creditParamValueTU: this.handleExceptionNumber(
          tuSummary?.find((x: any) => x["@_ID"] === "AP004")["@_Value"]
        ),
        creditParamValueEXP: this.handleExceptionNumber(
          expSummary?.find((x: any) => x["@_ID"] === "AP004")["@_Value"]
        ),
        creditParamValueEQF: this.handleExceptionNumber(
          eqfSummary?.find((x: any) => x["@_ID"] === "AP004")["@_Value"]
        ),
      };
      _creditlist.push(creditsumary);
    }
    return _creditlist;
  }
  static parseHistoryDetail(data: any): IImportAccountHistory[] {
    let _list = data?.tradeLinePartition?.map((item: any, index: number) => {
      let JQAccount = this.GetAccountObject();

      let TUHistory = item?.tradeline?.find(
        (x: any) => x.source.bureau.symbol === "TUC"
      );
      let EXPHistory = item?.tradeline?.find(
        (x: any) => x.source.bureau.symbol === "EXP"
      );
      let EQFHistory = item?.tradeline?.find(
        (x: any) => x.source.bureau.symbol === "EQF"
      );

      JQAccount.accountHeader =
        (TUHistory && TUHistory.creditorName) ||
        (EXPHistory && EXPHistory.creditorName) ||
        (EQFHistory && EQFHistory.creditorName) ||
        "N/A";

      // START adding all fields for account history
      let sumary;

      sumary = this.getParam(
        "Account #",
        TUHistory?.accountNumber,
        EXPHistory?.accountNumber,
        EQFHistory?.accountNumber
      );
      JQAccount.Summary.push(sumary);

      //sumary = getParam('Account Name', TUHistory && TUHistory.creditorName, EXPHistory && EXPHistory.creditorName, EQFHistory && EQFHistory.creditorName);
      //JQAccount.Summary.push(sumary);

      sumary = this.getParam(
        "Account Type:",
        TUHistory?.grantedTrade?.accountType?.description,
        EXPHistory?.grantedTrade?.accountType?.description,
        EQFHistory?.grantedTrade?.accountType?.description
      );
      JQAccount.Summary.push(sumary);

      sumary = this.getParam("Dispute Reason:", "", "", "");
      JQAccount.Summary.push(sumary);

      sumary = this.getParam(
        "Account Type - Detail:",
        TUHistory?.grantedTrade?.creditType?.description,
        EXPHistory?.grantedTrade?.creditType?.description,
        EQFHistory?.grantedTrade?.creditType?.description
      );
      JQAccount.Summary.push(sumary);

      sumary = this.getParam(
        "Bureau Code:",
        TUHistory?.accountDesignator?.description,
        EXPHistory?.accountDesignator?.description,
        EQFHistory?.accountDesignator?.description
      );
      JQAccount.Summary.push(sumary);

      sumary = this.getParam(
        "Account Status:",
        TUHistory?.openClosed?.description,
        EXPHistory?.openClosed?.description,
        EQFHistory?.openClosed?.description
      );
      JQAccount.Summary.push(sumary);

      sumary = this.getParam(
        "Monthly Payment:",
        TUHistory?.grantedTrade?.monthlyPayment,
        EXPHistory?.grantedTrade?.monthlyPayment,
        EQFHistory?.grantedTrade?.monthlyPayment
      );
      JQAccount.Summary.push(sumary);

      sumary = this.getParam(
        "Date Opened:",
        this.getDateInMMDDYYYY(TUHistory?.dateOpened),
        this.getDateInMMDDYYYY(EXPHistory?.dateOpened),
        this.getDateInMMDDYYYY(EQFHistory?.dateOpened)
      );
      JQAccount.Summary.push(sumary);

      sumary = this.getParam(
        "Balance:",
        "$" + (TUHistory?.currentBalance || "0"),
        "$" + (EXPHistory?.currentBalance || "0"),
        "$" + (EQFHistory?.currentBalance || "0")
      );
      JQAccount.Summary.push(sumary);

      sumary = this.getParam(
        "No. of Months (terms):",
        TUHistory?.grantedTrade?.termMonths,
        EXPHistory?.grantedTrade?.termMonths,
        EQFHistory?.grantedTrade?.termMonths
      );
      JQAccount.Summary.push(sumary);

      sumary = this.getParam(
        "High Credit:",
        "$" + (TUHistory?.highBalance || "0"),
        "$" + (EXPHistory?.highBalance || "0"),
        "$" + (EQFHistory?.highBalance || "0")
      );
      JQAccount.Summary.push(sumary);

      sumary = this.getParam(
        "Credit Limit:",
        TUHistory?.grantedTrade?.creditLimit,
        EXPHistory?.grantedTrade?.creditLimit,
        EQFHistory?.grantedTrade?.creditLimit
      );
      JQAccount.Summary.push(sumary);

      sumary = this.getParam(
        "Past Due:",
        "$" + (TUHistory?.grantedTrade?.amountPastDue || "0"),
        "$" + (EXPHistory?.grantedTrade?.amountPastDue || "0"),
        "$" + (EQFHistory?.grantedTrade?.amountPastDue || "0")
      );
      JQAccount.Summary.push(sumary);

      sumary = this.getParam(
        "Payment Status:",
        TUHistory?.payStatus?.description,
        EXPHistory?.payStatus?.description,
        EQFHistory?.payStatus?.description
      );
      JQAccount.Summary.push(sumary);

      sumary = this.getParam(
        "Last Reported:",
        TUHistory && this.getDateInMMDDYYYY(TUHistory.dateReported),
        EXPHistory && this.getDateInMMDDYYYY(EXPHistory.dateReported),
        EQFHistory && this.getDateInMMDDYYYY(EQFHistory.dateReported)
      );
      JQAccount.Summary.push(sumary);

      sumary = this.getParam(
        "Comments:",
        this.getComments(TUHistory?.remark),
        this.getComments(EXPHistory?.remark),
        this.getComments(EQFHistory?.remark)
      );
      JQAccount.Summary.push(sumary);

      sumary = this.getParam(
        "Date Last Active:",
        this.getDateInMMDDYYYY(TUHistory?.dateAccountStatus),
        this.getDateInMMDDYYYY(EXPHistory?.dateAccountStatus),
        this.getDateInMMDDYYYY(EQFHistory?.dateAccountStatus)
      );
      JQAccount.Summary.push(sumary);

      sumary = this.getParam(
        "Date of Last Payment:",
        this.getDateInMMDDYYYY(TUHistory?.grantedTrade?.dateLastPayment),
        this.getDateInMMDDYYYY(EXPHistory?.grantedTrade?.dateLastPayment),
        this.getDateInMMDDYYYY(EQFHistory?.grantedTrade?.dateLastPayment)
      );
      JQAccount.Summary.push(sumary);

      // END adding all fields for account history

      // START last 2 years account history

      // let TUAc24History = TUHistory && TUHistory.grantedTrade && TUHistory.grantedTrade.payStatusHistory && TUHistory.grantedTrade.payStatusHistory.monthlyPayStatus;
      // let EXPAc24History = EXPHistory && EXPHistory.grantedTrade && EXPHistory.grantedTrade.payStatusHistory && EXPHistory.grantedTrade.payStatusHistory.monthlyPayStatus;
      // let EQFAc24History = EQFHistory && EQFHistory.grantedTrade && EQFHistory.grantedTrade.payStatusHistory && EQFHistory.grantedTrade.payStatusHistory.monthlyPayStatus;

      //let history24 = get24MonthsHistory();
      ////JQAccount.MonthNames = GetNextTDsText(obj4);
      //JQAccount.MonthNames = new Array(24).fill({ MonthName: '' });
      //JQAccount.Years = new Array(24).fill({ Year: '' });
      //JQAccount.TransUnions = new Array(24).fill({ TUs: '' });
      //JQAccount.Experians = new Array(24).fill({ EXPs: '' });
      //JQAccount.Equifaxs = new Array(24).fill({ EQFs: '' });
      // END last 2 years account history
      return JQAccount;
    }) as IImportAccountHistory[];
    return _list;
  }
  static parseHistoryDetailArray(data: any): IImportAccountHistory[] {
    try {
      let _list = data?.CREDIT_LIABILITY?.map((item: any, index: number) => {
        let JQAccount = this.GetAccountObject();

        let TUHistory = null;
        let EXPHistory = null;
        let EQFHistory = null;
        if (Array.isArray(item?.CREDIT_REPOSITORY)) {
          TUHistory = item?.CREDIT_REPOSITORY?.some(
            (x: any) => x["@_SourceType"] === "TransUnion"
          )
            ? item
            : {};
          EXPHistory = item?.CREDIT_REPOSITORY?.some(
            (x: any) => x["@_SourceType"] === "Experian"
          )
            ? item
            : {};
          EQFHistory = item?.CREDIT_REPOSITORY?.some(
            (x: any) => x["@_SourceType"] === "Equifax"
          )
            ? item
            : {};
        } else {
          TUHistory =
            item?.CREDIT_REPOSITORY["@_SourceType"] === "TransUnion"
              ? item
              : {};
          EXPHistory =
            item?.CREDIT_REPOSITORY["@_SourceType"] === "Experian" ? item : {};
          EQFHistory =
            item?.CREDIT_REPOSITORY["@_SourceType"] === "Equifax" ? item : {};
        }
        JQAccount.accountHeader =
          (TUHistory?._CREDITOR && TUHistory?._CREDITOR["@_Name"]) ||
          (EXPHistory?._CREDITOR && EXPHistory?._CREDITOR["@_Name"]) ||
          (EQFHistory?._CREDITOR && EQFHistory?._CREDITOR["@_Name"]) ||
          "N/A";

        // START adding all fields for account history
        let sumary;

        sumary = this.getParam(
          "Account #",
          TUHistory["@_AccountIdentifier"],
          EXPHistory["@_AccountIdentifier"],
          EQFHistory["@_AccountIdentifier"]
        );
        JQAccount.Summary.push(sumary);

        // sumary = this.getParam('Account Name', TUHistory && TUHistory.creditorName, EXPHistory && EXPHistory.creditorName, EQFHistory && EQFHistory.creditorName);
        // JQAccount.Summary.push(sumary);

        sumary = this.getParam(
          "Account Type:",
          TUHistory["@_AccountType"],
          EXPHistory["@_AccountType"],
          EQFHistory["@_AccountType"]
        );
        JQAccount.Summary.push(sumary);

        sumary = this.getParam("Dispute Reason:", "", "", "");
        JQAccount.Summary.push(sumary);

        sumary = this.getParam(
          "Account Type - Detail:",
          TUHistory["@CreditLoanType"],
          EXPHistory["@CreditLoanType"],
          EQFHistory["@CreditLoanType"]
        );
        JQAccount.Summary.push(sumary);

        sumary = this.getParam(
          "Bureau Code:",
          TUHistory["@CreditTradeReferenceID"],
          EXPHistory["@CreditTradeReferenceID"],
          EQFHistory["@CreditTradeReferenceID"]
        );
        JQAccount.Summary.push(sumary);

        sumary = this.getParam(
          "Account Status:",
          TUHistory["@_AccountStatusType"],
          EXPHistory["@_AccountStatusType"],
          EQFHistory["@_AccountStatusType"]
        );
        JQAccount.Summary.push(sumary);

        sumary = this.getParam(
          "Monthly Payment:",
          TUHistory["@_MonthlyPaymentAmount"],
          EXPHistory["@_MonthlyPaymentAmount"],
          EQFHistory["@_MonthlyPaymentAmount"]
        );
        JQAccount.Summary.push(sumary);

        sumary = this.getParam(
          "Date Opened:",
          this.getDateInMMDDYYYY(TUHistory["@_AccountOpenedDate"]),
          this.getDateInMMDDYYYY(EXPHistory["@_AccountOpenedDate"]),
          this.getDateInMMDDYYYY(EQFHistory["@_AccountOpenedDate"])
        );
        JQAccount.Summary.push(sumary);

        sumary = this.getParam(
          "Balance:",
          "$" + (TUHistory["@_UnpaidBalanceAmount"] || "0"),
          "$" + (EXPHistory["@_UnpaidBalanceAmount"] || "0"),
          "$" + (EQFHistory["@_UnpaidBalanceAmount"] || "0")
        );
        JQAccount.Summary.push(sumary);

        sumary = this.getParam(
          "No. of Months (terms):",
          TUHistory["@_MonthsReviewedCount"],
          EXPHistory["@_MonthsReviewedCount"],
          EQFHistory["@_MonthsReviewedCount"]
        );
        JQAccount.Summary.push(sumary);

        sumary = this.getParam(
          "High Credit:",
          "$" + (TUHistory["@_HighCreditAmount"] || "0"),
          "$" + (EXPHistory["@_HighCreditAmount"] || "0"),
          "$" + (EQFHistory["@_HighCreditAmount"] || "0")
        );
        JQAccount.Summary.push(sumary);

        sumary = this.getParam(
          "Credit Limit:",
          TUHistory["@_CreditLimitAmount"],
          EXPHistory["@_CreditLimitAmount"],
          EQFHistory["@_CreditLimitAmount"]
        );
        JQAccount.Summary.push(sumary);

        sumary = this.getParam(
          "Past Due:",
          "$" + (TUHistory["@_PastDueAmount"] || "0"),
          "$" + (EXPHistory["@_PastDueAmount"] || "0"),
          "$" + (EQFHistory["@_PastDueAmount"] || "0")
        );
        JQAccount.Summary.push(sumary);

        sumary = this.getParam(
          "Payment Status:",
          TUHistory?._CURRENT_RATING && TUHistory?._CURRENT_RATING["@_Type"],
          EXPHistory?._CURRENT_RATING && EXPHistory?._CURRENT_RATING["@_Type"],
          EQFHistory?._CURRENT_RATING && EQFHistory?._CURRENT_RATING["@_Type"]
        );
        JQAccount.Summary.push(sumary);

        sumary = this.getParam(
          "Last Reported:",
          TUHistory &&
            this.getDateInMMDDYYYY(TUHistory["@_AccountReportedDate"]),
          EXPHistory &&
            this.getDateInMMDDYYYY(EXPHistory["@_AccountReportedDate"]),
          EQFHistory &&
            this.getDateInMMDDYYYY(EQFHistory["@_AccountReportedDate"])
        );
        JQAccount.Summary.push(sumary);

        sumary = this.getParam(
          "Comments:",
          this.getCommentsArray(TUHistory?.CREDIT_COMMENT),
          this.getCommentsArray(EXPHistory?.CREDIT_COMMENT),
          this.getCommentsArray(EQFHistory?.CREDIT_COMMENT)
        );
        JQAccount.Summary.push(sumary);

        sumary = this.getParam(
          "Date Last Active:",
          this.getDateInMMDDYYYY(TUHistory["@_LastActivityDate"]),
          this.getDateInMMDDYYYY(EXPHistory["@_LastActivityDate"]),
          this.getDateInMMDDYYYY(EQFHistory["@_LastActivityDate"])
        );
        JQAccount.Summary.push(sumary);

        sumary = this.getParam(
          "Date of Last Payment:",
          this.getDateInMMDDYYYY(TUHistory["@LastPaymentDate"]),
          this.getDateInMMDDYYYY(EXPHistory["@LastPaymentDate"]),
          this.getDateInMMDDYYYY(EQFHistory["@LastPaymentDate"])
        );
        JQAccount.Summary.push(sumary);

        JQAccount.collectorAddress = {
          collectorName: item?._CREDITOR && item?._CREDITOR["@_Name"],
          city: item?._CREDITOR && item?._CREDITOR["@_City"],
          state: item?._CREDITOR && item?._CREDITOR["@_State"],
          address: item?._CREDITOR && item?._CREDITOR["@_StreetAddress"],
          zip: item?._CREDITOR["@_PostalCode"],
        };
        JQAccount.extraFields = {
          isChargeoffIndicator: item["@IsChargeoffIndicator"] === "Y",
          isClosedIndicator: item["@IsClosedIndicator"] === "Y",
          isCollectionIndicator: item["@IsCollectionIndicator"] === "Y",
          isDerogatoryDataIndicator: item["@_DerogatoryDataIndicator"] === "Y",
          isMortgageIndicator: item["@IsMortgageIndicator"] === "Y",
        };
        // END adding all fields for account history

        // START last 2 years account history

        // let TUAc24History = TUHistory && TUHistory.grantedTrade && TUHistory.grantedTrade.payStatusHistory && TUHistory.grantedTrade.payStatusHistory.monthlyPayStatus;
        // let EXPAc24History = EXPHistory && EXPHistory.grantedTrade && EXPHistory.grantedTrade.payStatusHistory && EXPHistory.grantedTrade.payStatusHistory.monthlyPayStatus;
        // let EQFAc24History = EQFHistory && EQFHistory.grantedTrade && EQFHistory.grantedTrade.payStatusHistory && EQFHistory.grantedTrade.payStatusHistory.monthlyPayStatus;

        //let history24 = get24MonthsHistory();
        ////JQAccount.MonthNames = GetNextTDsText(obj4);
        //JQAccount.MonthNames = new Array(24).fill({ MonthName: '' });
        //JQAccount.Years = new Array(24).fill({ Year: '' });
        //JQAccount.TransUnions = new Array(24).fill({ TUs: '' });
        //JQAccount.Experians = new Array(24).fill({ EXPs: '' });
        //JQAccount.Equifaxs = new Array(24).fill({ EQFs: '' });
        // END last 2 years account history
        return JQAccount;
      }) as IImportAccountHistory[];
      return _list;
    } catch (e) {
      return [];
    }
  }
  static parseInquiryDetail(data: any): IImportCreditInquiry[] {
    let _list = [] as IImportCreditInquiry[];
    let flatList = data?.inquiryPartition?.flatMap((x: any) => x.inquiry);
    _list = flatList.map((item: any, index: number) => {
      const symbol = item?.source?.bureau?.symbol;
      let JQCreditEnquiry = {
        BankName: item?.subscriberName?.replace(/\s+/g, " "),
        CreditType:
          item?.industryCode?.description?.replace(/\s+/g, " ") || "-",
        CreditDate: this.getDateInMMDDYYYY(
          item?.inquiryDate?.replace(/\s+/g, " ")
        ),
        CheckedTU: symbol === "TUC",
        CheckedEXP: symbol === "EXP",
        CheckedEQF: symbol === "EQF",
      } as IImportCreditInquiry;
      const dateArr = JQCreditEnquiry?.CreditDate?.split("/");
      if (dateArr) {
        const year = +dateArr[2];
        const month = +dateArr[0];
        const day = +dateArr[1];
        JQCreditEnquiry.InqueryDate = new Date(year, month, day);
      }
      return JQCreditEnquiry;
    });
    _list.sort((a: any, b: any) => b?.InqueryDate - a?.InqueryDate); // sorting in descendng order
    return _list;
  }
  static parseInquiryDetailArray(data: any): IImportCreditInquiry[] {
    let _list = [] as IImportCreditInquiry[];
    let flatList = data?.CREDIT_INQUIRY;
    _list = flatList.map((item: any, index: number) => {
      const symbol = item?.CREDIT_REPOSITORY;
      let symbolList = [];
      if (!Array.isArray(symbol)) {
        symbolList.push(symbol);
      } else {
        symbolList = symbol;
      }
      let JQCreditEnquiry = {
        BankName: item["@_Name"]?.replace(/\s+/g, " "),
        CreditType: item["@CreditBusinessType"]?.replace(/\s+/g, " ") || "-",
        CreditDate: this.getDateInMMDDYYYY(
          item["@_Date"]?.replace(/\s+/g, " ")
        ),
        CheckedTU: symbolList?.some((x) => x["@_SourceType"] === "TransUnion"),
        CheckedEXP: symbolList?.some((x) => x["@_SourceType"] === "Experian"),
        CheckedEQF: symbolList?.some((x) => x["@_SourceType"] === "Equifax"),
      } as IImportCreditInquiry;
      const dateArr = JQCreditEnquiry?.CreditDate?.split("/");
      if (dateArr) {
        const year = +dateArr[2];
        const month = +dateArr[0];
        const day = +dateArr[1];
        JQCreditEnquiry.InqueryDate = new Date(year, month, day);
      }
      return JQCreditEnquiry;
    });
    _list.sort((a: any, b: any) => b?.InqueryDate - a?.InqueryDate); // sorting in descendng order
    return _list;
  }
  static parsePublicRecordDetail(data: any): IImportPublicRecords[] {
    return data?.pulblicRecordPartition?.map((item: any, index: number) => {
      let TUHistory = item?.publicRecord?.find(
        (x: any) => x.source.bureau.symbol === "TUC"
      );
      let EXPHistory = item?.publicRecord?.find(
        (x: any) => x.source.bureau.symbol === "EXP"
      );
      let EQFHistory = item?.publicRecord?.find(
        (x: any) => x.source.bureau.symbol === "EQF"
      );

      let JQPublicRecord = this.GetPublicRecordObject();

      JQPublicRecord.publicRecordHeader =
        TUHistory?.classification?.description ||
        EXPHistory?.classification?.description ||
        EQFHistory?.classification?.description;

      JQPublicRecord.publicRecordSummary = [];

      let publicRecordSummary = {
        publicRecordParam: "Type:",
        publicRecordParamValueEXP: EXPHistory?.type?.description,
        publicRecordParamValueTU: TUHistory?.type?.description,
        publicRecordParamValueEQF: EQFHistory?.type?.description,
      };
      JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

      publicRecordSummary = {
        publicRecordParam: "Status:",
        publicRecordParamValueEXP: EXPHistory?.status?.description,
        publicRecordParamValueTU: TUHistory?.status?.description,
        publicRecordParamValueEQF: EQFHistory?.status?.description,
      };
      JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

      publicRecordSummary = {
        publicRecordParam: "Date Filed/Reported:",
        publicRecordParamValueEXP: this.getDateInMMDDYYYY(
          EXPHistory?.dateFiled
        ),
        publicRecordParamValueTU: this.getDateInMMDDYYYY(TUHistory?.dateFiled),
        publicRecordParamValueEQF: this.getDateInMMDDYYYY(
          EQFHistory?.dateFiled
        ),
      };
      JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

      publicRecordSummary = {
        publicRecordParam: "Reference#:",
        publicRecordParamValueEXP: EXPHistory?.referenceNumber,
        publicRecordParamValueTU: TUHistory?.referenceNumber,
        publicRecordParamValueEQF: EQFHistory?.referenceNumber,
      };
      JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

      publicRecordSummary = {
        publicRecordParam: "Closing Date:",
        publicRecordParamValueEXP: this.getDateInMMDDYYYY(
          EXPHistory?.bankruptcy?.dateResolved
        ),
        publicRecordParamValueTU: this.getDateInMMDDYYYY(
          TUHistory?.bankruptcy?.dateResolved
        ),
        publicRecordParamValueEQF: this.getDateInMMDDYYYY(
          EQFHistory?.bankruptcy?.dateResolved
        ),
      };
      JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

      publicRecordSummary = {
        publicRecordParam: "Asset Amount:",
        publicRecordParamValueEXP: EXPHistory?.bankruptcy?.assetAmount,
        publicRecordParamValueTU: TUHistory?.bankruptcy?.assetAmount,
        publicRecordParamValueEQF: EQFHistory?.bankruptcy?.assetAmount,
      };
      JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

      publicRecordSummary = {
        publicRecordParam: "Court:",
        publicRecordParamValueEXP: EXPHistory?.courtName,
        publicRecordParamValueTU: TUHistory?.courtName,
        publicRecordParamValueEQF: EQFHistory?.courtName,
      };
      JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

      publicRecordSummary = {
        publicRecordParam: "Liability:",
        publicRecordParamValueEXP: EXPHistory?.bankruptcy?.liabilityAmount,
        publicRecordParamValueTU: TUHistory?.bankruptcy?.liabilityAmount,
        publicRecordParamValueEQF: EQFHistory?.bankruptcy?.liabilityAmount,
      };
      JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

      publicRecordSummary = {
        publicRecordParam: "Exempt Amount:",
        publicRecordParamValueEXP: EXPHistory?.bankruptcy?.exemptAmount,
        publicRecordParamValueTU: TUHistory?.bankruptcy?.exemptAmount,
        publicRecordParamValueEQF: EQFHistory?.bankruptcy?.exemptAmount,
      };
      JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

      publicRecordSummary = {
        publicRecordParam: "Remarks:	",
        publicRecordParamValueEXP: EXPHistory?.remark?.join(", "),
        publicRecordParamValueTU: TUHistory?.remark?.join(", "),
        publicRecordParamValueEQF: EQFHistory?.remark?.join(", "),
      };
      JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

      return JQPublicRecord;
    });
  }
  static parsePublicRecordDetailArray(data: any): IImportPublicRecords[] {
    return data?.CREDIT_PUBLIC_RECORD?.map((item: any, index: number) => {
      const symbol = item?.CREDIT_REPOSITORY;
      let symbolList = [];
      if (!Array.isArray(symbol)) {
        symbolList.push(symbol);
      } else {
        symbolList = symbol;
      }

      let TUHistory = symbolList?.some(
        (x: any) => x["@_SourceType"] === "TransUnion"
      )
        ? item
        : {};
      let EXPHistory = symbolList?.some(
        (x: any) => x["@_SourceType"] === "Experian"
      )
        ? item
        : {};
      let EQFHistory = symbolList?.some(
        (x: any) => x["@_SourceType"] === "Equifax"
      )
        ? item
        : {};

      let JQPublicRecord = this.GetPublicRecordObject();

      JQPublicRecord.publicRecordHeader =
        (TUHistory && TUHistory["@_CourtName"]) ||
        (EXPHistory && EXPHistory["@_CourtName"]) ||
        (EQFHistory && EQFHistory["@_CourtName"]);

      JQPublicRecord.publicRecordSummary = [];

      let publicRecordSummary = {
        publicRecordParam: "Type:",
        publicRecordParamValueEXP: EXPHistory["@_Type"],
        publicRecordParamValueTU: TUHistory["@_Type"],
        publicRecordParamValueEQF: EQFHistory["@_Type"],
      };
      JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

      publicRecordSummary = {
        publicRecordParam: "Status:",
        publicRecordParamValueEXP: EXPHistory["@_DispositionType"],
        publicRecordParamValueTU: TUHistory["@_DispositionType"],
        publicRecordParamValueEQF: EQFHistory["@_DispositionType"],
      };
      JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

      publicRecordSummary = {
        publicRecordParam: "Date Filed/Reported:",
        publicRecordParamValueEXP: this.getDateInMMDDYYYY(
          EXPHistory["@_FiledDate"]
        ),
        publicRecordParamValueTU: this.getDateInMMDDYYYY(
          TUHistory["@_FiledDate"]
        ),
        publicRecordParamValueEQF: this.getDateInMMDDYYYY(
          EQFHistory["@_FiledDate"]
        ),
      };
      JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

      publicRecordSummary = {
        publicRecordParam: "Reference#:",
        publicRecordParamValueEXP: EXPHistory["@_DocketIdentifier"],
        publicRecordParamValueTU: TUHistory["@_DocketIdentifier"],
        publicRecordParamValueEQF: EQFHistory["@_DocketIdentifier"],
      };
      JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

      publicRecordSummary = {
        publicRecordParam: "Closing Date:",
        publicRecordParamValueEXP: this.getDateInMMDDYYYY(
          EXPHistory["@_DispositionDate"]
        ),
        publicRecordParamValueTU: this.getDateInMMDDYYYY(
          TUHistory["@_DispositionDate"]
        ),
        publicRecordParamValueEQF: this.getDateInMMDDYYYY(
          EQFHistory["@_DispositionDate"]
        ),
      };
      JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

      publicRecordSummary = {
        publicRecordParam: "Asset Amount:",
        publicRecordParamValueEXP: "",
        publicRecordParamValueTU: "",
        publicRecordParamValueEQF: "",
      };
      JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

      publicRecordSummary = {
        publicRecordParam: "Court:",
        publicRecordParamValueEXP: EXPHistory["@_CourtName"],
        publicRecordParamValueTU: TUHistory["@_CourtName"],
        publicRecordParamValueEQF: EQFHistory["@_CourtName"],
      };
      JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

      publicRecordSummary = {
        publicRecordParam: "Liability:",
        publicRecordParamValueEXP: EXPHistory["@_AccountOwnershipType"],
        publicRecordParamValueTU: TUHistory["@_AccountOwnershipType"],
        publicRecordParamValueEQF: EQFHistory["@_AccountOwnershipType"],
      };
      JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

      publicRecordSummary = {
        publicRecordParam: "Exempt Amount:",
        publicRecordParamValueEXP: "",
        publicRecordParamValueTU: "",
        publicRecordParamValueEQF: "",
      };
      JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

      publicRecordSummary = {
        publicRecordParam: "Remarks:	",
        publicRecordParamValueEXP: "",
        publicRecordParamValueTU: "",
        publicRecordParamValueEQF: "",
      };
      JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

      return JQPublicRecord;
    });
  }
  private static GetPublicRecordObject(): IImportPublicRecords {
    return {
      publicRecordHeader: "",
      publicRecordSummary: [],
    };
  }
  private static getComments(list: any) {
    return list?.map((x: any) => x.remarkCode.description)?.join(", ") ?? "";
  }
  private static getCommentsArray(list: any) {
    return Array.isArray(list)
      ? list?.map((x: any) => x && x["@_Text"])?.join(", ") ?? ""
      : list && list["@_Text"];
  }
  private static getParam(text: any, tu: any, exp: any, eqf: any) {
    return {
      accountParam: text,
      accountParamValueTU: tu,
      accountParamValueEXP: exp,
      accountParamValueEQF: eqf,
    };
  }
  private static getDateInMMDDYYYY(date: any) {
    if (date && date.indexOf("-") !== -1) {
      let arr = date.split("-");
      return arr[1] + "/" + arr[2] + "/" + arr[0];
    }
    return "";
  }
  private static GetAccountObject(): IImportAccountHistory {
    return {
      accountHeader: "",
      Summary: [],
      MonthNames: [],
      Years: [],
      Experians: [],
      Equifaxs: [],
      TransUnions: [],
      collectorAddress: undefined,
    };
  }
  private static getPersonalDetailsForBureau(list: any[], bureau: string) {
    const creditFile = list?.find(
      (x) => x["@CreditRepositorySourceType"] === bureau
    );
    const result = {} as any;
    result["reportDate"] = this.handleException(
      this.getDateInMMDDYYYY(creditFile["@_InfileDate"])
    );
    result["fullName"] = this.handleException(
      creditFile["_BORROWER"]["@_UnparsedName"]
    );
    const aliasList = !Array.isArray(creditFile["_BORROWER"]["_ALIAS"])
      ? [creditFile["_BORROWER"]["_ALIAS"]]
      : creditFile["_BORROWER"]["_ALIAS"];
    result["alias"] = this.handleException(
      aliasList?.map((x) => x["@_UnparsedName"])?.join(", ")
    );
    result["former"] = "";
    result["dob"] = this.handleException(
      this.getDateInMMDDYYYY(creditFile["_BORROWER"]["@_BirthDate"])
    );
    const currAddress = this.handleException(
      creditFile["_BORROWER"]["_RESIDENCE"]?.find(
        (x: any) => x && x["@BorrowerResidencyType"] === "Current"
      )
    );
    result["currentAddress"] = this.handleExceptionArray([
      this.getArrayFullAddress(currAddress),
    ]);
    const preAddList = !Array.isArray(creditFile["_BORROWER"]["_RESIDENCE"])
      ? [creditFile["_BORROWER"]["_RESIDENCE"]]
      : creditFile["_BORROWER"]["_RESIDENCE"];
    const priorAddresses = this.handleExceptionArray(
      preAddList?.filter(
        (x: any) => x && x["@BorrowerResidencyType"] === "Prior"
      )
    );
    const prevAddresses = this.handleExceptionArray(
      priorAddresses?.map((x: any) => this.getArrayFullAddress(x))
    );
    result["previousAddresses"] = prevAddresses;
    const emplist = !Array.isArray(creditFile["_BORROWER"]["EMPLOYER"])
      ? [creditFile["_BORROWER"]["EMPLOYER"]]
      : creditFile["_BORROWER"]["EMPLOYER"];
    result["employers"] = this.handleExceptionArray(
      emplist?.map((x: any) => x && x["@_Name"])?.join(", ")
    );
    result["alerts"] = this.handleExceptionArray(
      creditFile["_BORROWER"]["_ALERT_MESSAGE"]
        ?.map((x: any) => x && x["_Text"])
        ?.join(", ")
    );

    return result;
  }
  private static getArrayFullAddress(data: any): any {
    let address = "";
    if (data["@_StreetAddress"]) {
      address += data["@_StreetAddress"];
    }
    if (data["@_City"]) {
      address += (address ? ", " : "") + data["@_City"];
    }
    if (data["@_State"]) {
      address += (address ? ", " : "") + data["@_State"];
    }
    if (data["@_PostalCode"]) {
      address += (address ? ", " : "") + data["@_PostalCode"];
    }

    return address;
  }
  private static handleException(data: any): any {
    try {
      return data;
    } catch (e) {
      return "";
    }
  }
  private static handleExceptionArray(data: any): any {
    try {
      return data;
    } catch (e) {
      return [];
    }
  }
  private static handleExceptionNumber(data: any): any {
    try {
      return data;
    } catch (e) {
      return 0;
    }
  }
}
