// GENERATED placeholder script – fill in during P1
using UnityEngine;

public class DangerTimeSystem : MonoBehaviour {
    public float baseTime = 1.2f;
    public float charFactor = 0.05f;
    public float panicPenalty = 0.4f;

    public float Calculate(float chars, int panic){
        return baseTime + chars * charFactor - panic * panicPenalty;
    }
}
