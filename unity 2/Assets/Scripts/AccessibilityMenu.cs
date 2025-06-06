
using UnityEngine;
using TMPro;

public class AccessibilityMenu : MonoBehaviour {
    [SerializeField] TMP_Dropdown fontSizeDropdown;
    [SerializeField] GameObject captionsToggle;

    public void OnFontSizeChanged(int idx){
        int size = 14 + idx*2; //14,16,18,20
        TMP_Settings.defaultFontSize = size;
    }

    public void OnCaptions(bool on){
        PlayerPrefs.SetInt("captions", on?1:0);
        // Later: show/hide caption panel
    }
}
