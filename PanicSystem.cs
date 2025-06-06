// GENERATED placeholder script – fill in during P1
using UnityEngine;

public class PanicSystem {
    public int Level { get; private set; }

    public void Modify(int delta){
        Level = Mathf.Clamp(Level + delta, 0, 2);
    }
}
