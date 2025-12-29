package com.haunguyen.hello_spring_boot.Service;

import com.haunguyen.hello_spring_boot.dto.request.GroupRequest;
import com.haunguyen.hello_spring_boot.dto.response.GroupResponse;
import com.haunguyen.hello_spring_boot.entity.Group;
import com.haunguyen.hello_spring_boot.mapper.GroupMapper;
import com.haunguyen.hello_spring_boot.repository.GroupRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class GroupService {

    GroupMapper groupMapper;
    GroupRepository groupRepository;

    public GroupResponse create(GroupRequest request){
        Group group = groupMapper.toGroup(request);

        group = groupRepository.save(group);

        return groupMapper.toGroupResponse(group);
    }

    public List<GroupResponse> getAll(){
        var groups = groupRepository.findAll();

        return groups.stream().map(p -> groupMapper.toGroupResponse(p)).toList();
    }

    public void delete(String group){
        groupRepository.deleteById(group);
    }
}
