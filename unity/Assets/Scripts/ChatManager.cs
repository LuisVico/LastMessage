// GENERATED placeholder script – fill in during P1
using UnityEngine;

using TMPro;
using System.Collections.Generic;

public class ChatManager : MonoBehaviour {
    [SerializeField] private Transform contentRoot;
    [SerializeField] private GameObject bubblePrefab;
    [SerializeField] private TMP_InputField input;
    [SerializeField] private SuggestionBar suggestions;

    void Start(){
        NarrativeEngine.Instance.OnMessage += RenderBubble;
        NarrativeEngine.Instance.StartStory();
    }

    void RenderBubble(Message msg){
        var go = Instantiate(bubblePrefab, contentRoot);
        go.GetComponentInChildren<TMP_Text>().text = msg.text;
        // simple layout – refine with ContentSizeFitter
    }

    public void OnSend(){
        NarrativeEngine.Instance.PlayerSend(input.text);
        input.text = string.Empty;
    }
}
