
using UnityEngine;
using TMPro;

public class PanicSystem : MonoBehaviour {
    public int Level { get; private set; }
    [SerializeField] Camera mainCam;
    [SerializeField] float shakeAmount = 0.08f;
    Vector3 camOriginalPos;

    void Awake(){
        camOriginalPos = mainCam.transform.localPosition;
    }

    public void Modify(int delta){
        Level = Mathf.Clamp(Level + delta, 0, 2);
        ApplyEffects();
    }

    void ApplyEffects(){
        StopAllCoroutines();
        if(Level > 1){
            StartCoroutine(ShakeCam());
        }else{
            mainCam.transform.localPosition = camOriginalPos;
        }
    }

    System.Collections.IEnumerator ShakeCam(){
        float t = 0.6f;
        while(t > 0){
            mainCam.transform.localPosition = camOriginalPos + Random.insideUnitSphere * shakeAmount;
            t -= Time.deltaTime;
            yield return null;
        }
        mainCam.transform.localPosition = camOriginalPos;
    }

    // Typo helper
    public string MaybeGarble(string input){
        if(Level == 0) return input;
        System.Text.StringBuilder sb = new System.Text.StringBuilder();
        foreach(char c in input){
            if(Random.value < Level * 0.05f && char.IsLetter(c)){
                sb.Append((char)(c + (Random.value > 0.5f ? 1 : -1)));
            }else sb.Append(c);
        }
        return sb.ToString();
    }
}
