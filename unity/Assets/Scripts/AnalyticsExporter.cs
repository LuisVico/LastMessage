// GENERATED placeholder script – fill in during P1
using UnityEngine;

using UnityEngine.Analytics;
using System.Collections.Generic;

public static class AnalyticsExporter {
    public static void LogChoice(string choiceId, int panic){
        Analytics.CustomEvent("ChoiceMade", new Dictionary<string, object>{
            {"choice_id", choiceId},
            {"panic", panic}
        });
    }
}
