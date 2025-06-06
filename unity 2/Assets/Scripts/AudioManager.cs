
using UnityEngine;
using FMODUnity;

public class AudioManager : MonoBehaviour {
    [SerializeField] EventReference footsteps;
    [SerializeField] EventReference heartbeat;

    public void PlayFootsteps(){
        RuntimeManager.PlayOneShot(footsteps);
    }

    public void PlayHeartbeat(){
        RuntimeManager.PlayOneShot(heartbeat);
    }
}
