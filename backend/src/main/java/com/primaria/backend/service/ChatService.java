package com.primaria.backend.service;

import com.primaria.backend.model.ChatLog;
import com.primaria.backend.repository.ChatLogRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChatService {

    private final ChatLogRepository repo;

    public ChatService(ChatLogRepository repo) {
        this.repo = repo;
    }

    public void save(String username, String prompt, String response) {
        ChatLog log = new ChatLog(username, prompt, response);
        repo.save(log);
    }

    public List<ChatLog> getHistoryByUsername(String username) {
        return repo.findByUsername(username);
    }
}


